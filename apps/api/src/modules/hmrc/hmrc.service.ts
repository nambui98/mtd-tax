/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { Database } from '@workspace/database';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { hmrcTokensTable, usersTable } from '@workspace/database/dist/schema';
import { addSeconds } from 'date-fns';

@Injectable()
export class HmrcService {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;
    private readonly baseUrl: string;
    private readonly tokenUrl: string;
    private readonly apiUrl: string;

    constructor(
        private readonly configService: ConfigService,
        @Inject(DATABASE_CONNECTION) private readonly db: Database,
    ) {
        this.clientId = this.configService.get<string>('HMRC_CLIENT_ID') || '';
        this.clientSecret =
            this.configService.get<string>('HMRC_CLIENT_SECRET') || '';
        this.redirectUri =
            this.configService.get<string>('HMRC_REDIRECT_URI') || '';
        this.baseUrl = this.configService.get<string>('HMRC_BASE_URL') || '';
        this.apiUrl = this.configService.get<string>('HMRC_API_URL') || '';
        this.tokenUrl = `${this.apiUrl}/oauth/token`;
    }

    async getAuthorizationUrl(
        state: string,
        body: { userId: string; arn?: string; utr?: string; nino?: string },
    ): Promise<string> {
        await this.db
            .update(usersTable)
            .set({
                agentReferenceNumber: body.arn,
                utr: body.utr,
                nino: body.nino,
                updatedAt: new Date(),
            })
            .where(eq(usersTable.id, body.userId));
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: 'hello read:agent-authorisation write:agent-authorisation read:sent-invitations write:sent-invitations',
            state,
        });

        return `${this.baseUrl}/oauth/authorize?${params.toString()}`;
    }

    async exchangeCodeForToken(
        userId: string,
        code: string,
    ): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }> {
        try {
            const response = await axios.post(
                this.tokenUrl,
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    redirect_uri: this.redirectUri,
                    code,
                    scope: 'hello read:agent-authorisation write:agent-authorisation read:sent-invitations write:sent-invitations',
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            const { access_token, refresh_token, expires_in } = response.data;
            console.log('====================================1');
            console.log(response.data);
            console.log('====================================1');
            // Store tokens in database
            await this.db.insert(hmrcTokensTable).values({
                userId,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: addSeconds(new Date(), expires_in),
            });

            return response.data;
        } catch (error) {
            throw new UnauthorizedException(
                'Failed to exchange code for token',
            );
        }
    }

    async refreshToken(userId: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }> {
        try {
            // Get current refresh token
            const [currentToken] = await this.db
                .select()
                .from(hmrcTokensTable)
                .where(eq(hmrcTokensTable.userId, userId));

            if (!currentToken) {
                throw new UnauthorizedException('No HMRC token found for user');
            }

            const response = await axios.post(
                this.tokenUrl,
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: currentToken.refreshToken,
                    scope: 'hello read:agent-authorisation write:agent-authorisation read:sent-invitations write:sent-invitations',
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            const { access_token, refresh_token, expires_in } = response.data;

            // Update tokens in database
            await this.db
                .update(hmrcTokensTable)
                .set({
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresAt: addSeconds(new Date(), expires_in),
                    updatedAt: new Date(),
                })
                .where(eq(hmrcTokensTable.userId, userId));

            return response.data;
        } catch (error) {
            throw new UnauthorizedException('Failed to refresh token');
        }
    }

    async getAccessToken(userId: string): Promise<string> {
        const [token] = await this.db
            .select()
            .from(hmrcTokensTable)
            .where(eq(hmrcTokensTable.userId, userId));

        if (!token) {
            throw new UnauthorizedException('No HMRC token found for user');
        }

        // Check if token is expired or about to expire (within 5 minutes)
        if (token.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
            const { access_token } = await this.refreshToken(userId);
            return access_token;
        }

        return token.accessToken;
    }

    async getArn(userId: string): Promise<string> {
        const [user] = await this.db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId));

        if (!user) {
            throw new UnauthorizedException('No user found for user');
        }

        return user.agentReferenceNumber ?? '';
    }

    async getVatObligations(userId: string, vrn: string): Promise<any> {
        try {
            const accessToken = await this.getAccessToken(userId);
            const response = await axios.get(
                `${this.apiUrl}/organisations/vat/${vrn}/obligations`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.hmrc.1.0+json',
                    },
                },
            );

            return response.data;
        } catch (error) {
            throw new BadRequestException('Failed to fetch VAT obligations');
        }
    }

    async submitVatReturn(
        userId: string,
        vrn: string,
        returnData: any,
    ): Promise<any> {
        try {
            const accessToken = await this.getAccessToken(userId);
            const response = await axios.post(
                `${this.apiUrl}/organisations/vat/${vrn}/returns`,
                returnData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/vnd.hmrc.1.0+json',
                    },
                },
            );

            return response.data;
        } catch (error) {
            throw new BadRequestException('Failed to submit VAT return');
        }
    }

    async getVatLiabilities(userId: string, vrn: string): Promise<any> {
        try {
            const accessToken = await this.getAccessToken(userId);
            const response = await axios.get(
                `${this.apiUrl}/organisations/vat/${vrn}/liabilities`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.hmrc.1.0+json',
                    },
                },
            );

            return response.data;
        } catch (error) {
            throw new BadRequestException('Failed to fetch VAT liabilities');
        }
    }

    async hmrcHello() {
        const response = await axios.get(
            'https://test-api.service.hmrc.gov.uk/hello/world',
            {
                headers: {
                    // Authorization: `Bearer ${this.clientId}`,
                    Accept: 'application/vnd.hmrc.1.0+json',
                    // Accept: 'application/json',
                },
            },
        );
        console.log(response.data);
        return response.data;
    }

    async hmrcInvitation() {
        const response = await axios.post(
            // `${this.apiUrl}/organisations/vat/invitations`,
            'https://test-api.service.hmrc.gov.uk/agents/ARN1234567/invitations',
            {
                service: ['MTD-VAT'],
                clientType: 'business',
                clientIdType: 'vrn',
                clientId: '101747696',
                knownFact: '2007-05-18',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.hmrc.1.0+json',
                    Authorization: `Bearer ${this.clientId}`,
                },
            },
        );
        console.log(response.data);
        return response.data;
    }

    async getClientAgencyRelationshipByUtr(
        userId: string,
        arn: string,
        utr: string,
        service: string[] = ['MTD-IT'],
        knownFact?: string,
    ): Promise<{
        isAuthorised: boolean;
        relationship?: {
            service: string[];
            status: 'active' | 'inactive';
            arn: string;
            clientId: string;
            clientIdType: string;
            checkedAt: string;
        };
    }> {
        try {
            const accessToken = await this.getAccessToken(userId);
            const arn = await this.getArn(userId);
            // Prepare the request payload
            const requestPayload = {
                service,
                clientIdType: 'utr',
                clientId: utr,
                ...(knownFact && { knownFact }),
            };

            const response = await axios.post(
                `${this.apiUrl}/agents/${arn}/relationships`,
                requestPayload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/vnd.hmrc.1.0+json',
                    },
                },
            );
            console.log(response.data);

            // 204 means relationship is active
            return {
                isAuthorised: true,
                relationship: {
                    service,
                    status: 'active',
                    arn,
                    clientId: utr,
                    clientIdType: 'utr',
                    checkedAt: new Date().toISOString(),
                },
            };
        } catch (error: any) {
            // 404 means relationship is inactive or not found
            if (error.response?.status === 404) {
                return {
                    isAuthorised: false,
                    relationship: {
                        service,
                        status: 'inactive',
                        arn,
                        clientId: utr,
                        clientIdType: 'utr',
                        checkedAt: new Date().toISOString(),
                    },
                };
            }

            // Handle other HMRC API errors
            if (error.response?.status === 403) {
                const errorCode = error.response.data?.code;
                switch (errorCode) {
                    case 'CLIENT_REGISTRATION_NOT_FOUND':
                        throw new NotFoundException(
                            'Client not found in HMRC records',
                        );
                    case 'NOT_AN_AGENT':
                        throw new UnauthorizedException(
                            'User is not registered as an agent',
                        );
                    case 'AGENT_NOT_SUBSCRIBED':
                        throw new UnauthorizedException(
                            'Agent not subscribed to HMRC services',
                        );
                    default:
                        throw new BadRequestException(
                            `HMRC API error: ${errorCode}`,
                        );
                }
            }

            if (error.response?.status === 400) {
                throw new BadRequestException('Invalid request parameters');
            }

            throw new BadRequestException(
                'Failed to check client-agency relationship with HMRC',
            );
        }
    }

    async getAgentClients(userId: string, arn: string): Promise<any> {
        try {
            const accessToken = await this.getAccessToken(userId);

            const response = await axios.get(
                `${this.apiUrl}/agents/${arn}/invitations`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.hmrc.1.0+json',
                    },
                },
            );

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 204) {
                // No invitations found
                return [];
            }

            throw new BadRequestException(
                'Failed to retrieve agent clients from HMRC',
            );
        }
    }

    async checkAgencyRelationship(
        userId: string,
        agencyId: string,
        utr: string,
    ): Promise<{
        hasRelationship: boolean;
        relationshipData?: {
            service: string[];
            status: 'active' | 'inactive';
            arn: string;
            clientId: string;
            clientIdType: string;
            checkedAt: string;
        };
    }> {
        try {
            // Validate inputs
            if (!/^\d{10}$/.test(utr)) {
                throw new BadRequestException(
                    'Invalid UTR format. UTR must be exactly 10 digits.',
                );
            }

            // if (!/^ARN\d+$/.test(agencyId)) {
            //     throw new BadRequestException(
            //         'Invalid agency ID format. Agency ID must start with ARN followed by numbers.',
            //     );
            // }
            const arn = await this.getArn(userId);

            // Check relationship using existing method
            const relationship = await this.getClientAgencyRelationshipByUtr(
                userId,
                arn,
                utr,
                ['MTD-IT', 'MTD-VAT'], // Check both services
            );

            return {
                hasRelationship: relationship.isAuthorised,
                relationshipData: relationship.relationship,
            };
        } catch (error: any) {
            // Handle specific HMRC API errors
            if (error.response?.status === 404) {
                // No relationship found
                return {
                    hasRelationship: false,
                    relationshipData: {
                        service: ['MTD-IT', 'MTD-VAT'],
                        status: 'inactive',
                        arn: agencyId,
                        clientId: utr,
                        clientIdType: 'utr',
                        checkedAt: new Date().toISOString(),
                    },
                };
            }

            if (error.response?.status === 403) {
                const errorCode = error.response.data?.code;
                switch (errorCode) {
                    case 'CLIENT_REGISTRATION_NOT_FOUND':
                        throw new NotFoundException(
                            'Client not found in HMRC records',
                        );
                    case 'NOT_AN_AGENT':
                        throw new UnauthorizedException(
                            'User is not registered as an agent',
                        );
                    case 'AGENT_NOT_SUBSCRIBED':
                        throw new UnauthorizedException(
                            'Agent not subscribed to HMRC services',
                        );
                    default:
                        throw new BadRequestException(
                            `HMRC API error: ${errorCode}`,
                        );
                }
            }

            if (error.response?.status === 400) {
                throw new BadRequestException('Invalid request parameters');
            }

            // For other errors, return no relationship
            return {
                hasRelationship: false,
                relationshipData: {
                    service: ['MTD-IT', 'MTD-VAT'],
                    status: 'inactive',
                    arn: agencyId,
                    clientId: utr,
                    clientIdType: 'utr',
                    checkedAt: new Date().toISOString(),
                },
            };
        }
    }

    async requestAgencyRelationship(
        userId: string,
        agencyId: string,
        utr: string,
        knownFact?: string,
    ): Promise<{
        success: boolean;
        invitationId?: string;
        message: string;
        status: 'pending' | 'accepted' | 'rejected';
    }> {
        try {
            // Validate inputs
            if (!/^\d{10}$/.test(utr)) {
                throw new BadRequestException(
                    'Invalid UTR format. UTR must be exactly 10 digits.',
                );
            }

            // if (!/^ARN\d+$/.test(agencyId)) {
            //     throw new BadRequestException(
            //         'Invalid agency ID format. Agency ID must start with ARN followed by numbers.',
            //     );
            // }

            const accessToken = await this.getAccessToken(userId);
            const arn = await this.getArn(userId);
            console.log(accessToken);

            // Test ARN exists first
            try {
                const testResponse = await axios.get(
                    `${this.apiUrl}/agents/${arn}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            Accept: 'application/vnd.hmrc.1.0+json',
                        },
                    },
                );
                console.log('✅ ARN test successful:', testResponse.data);
            } catch (testError: any) {
                if (testError.response?.status === 404) {
                    throw new BadRequestException(
                        `ARN ${arn} not found in HMRC. Please verify your Agent Reference Number.`,
                    );
                }
                throw testError;
            }

            // Prepare the invitation request payload
            const requestPayload = {
                service: ['MTD-IT', 'MTD-VAT'],
                clientType: 'individual',
                clientIdType: 'utr',
                clientId: utr,
                ...(knownFact && { knownFact }),
            };

            console.log('📤 Making invitation request:', {
                url: `${this.apiUrl}/agents/${arn}/invitations`,
                payload: requestPayload,
            });

            const response = await axios.post(
                `${this.apiUrl}/agents/${arn}/invitations`,
                requestPayload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/vnd.hmrc.1.0+json',
                    },
                },
            );
            // console.log(response.data);

            // HMRC returns 201 for successful invitation creation
            if (response.status === 201) {
                return {
                    success: true,
                    invitationId: response.data?.invitationId,
                    message:
                        'Relationship invitation sent successfully. The client will receive a notification to authorize the relationship.',
                    status: 'pending',
                };
            }

            return {
                success: false,
                message: 'Failed to send relationship invitation',
                status: 'pending',
            };
        } catch (error: any) {
            console.log(error.response.data);
            // Handle specific HMRC API errors
            if (error.response?.status === 400) {
                const errorCode = error.response.data?.code;
                switch (errorCode) {
                    case 'CLIENT_REGISTRATION_NOT_FOUND':
                        throw new BadRequestException(
                            'Client not found in HMRC records. Please verify the UTR is correct.',
                        );
                    case 'INVALID_KNOWN_FACT':
                        throw new BadRequestException(
                            'Invalid known fact provided. Please check the client information.',
                        );
                    case 'DUPLICATE_INVITATION':
                        throw new BadRequestException(
                            'An invitation has already been sent for this client. Please wait for their response.',
                        );
                    default:
                        throw new BadRequestException(
                            `Invalid request: ${errorCode}`,
                        );
                }
            }

            if (error.response?.status === 403) {
                const errorCode = error.response.data?.code;
                switch (errorCode) {
                    case 'NOT_AN_AGENT':
                        throw new UnauthorizedException(
                            'User is not registered as an agent with HMRC',
                        );
                    case 'AGENT_NOT_SUBSCRIBED':
                        throw new UnauthorizedException(
                            'Agent not subscribed to required HMRC services',
                        );
                    case 'AGENT_NOT_AUTHORIZED':
                        throw new UnauthorizedException(
                            'Agent not authorized to send invitations',
                        );
                    default:
                        throw new BadRequestException(
                            `Authorization error: ${errorCode}`,
                        );
                }
            }

            if (error.response?.status === 409) {
                throw new BadRequestException(
                    'A relationship already exists with this client',
                );
            }

            throw new BadRequestException(
                'Failed to send relationship invitation. Please try again later.',
            );
        }
    }

    async getPendingInvitations(
        userId: string,
        agencyId: string,
    ): Promise<{
        invitations: Array<{
            invitationId: string;
            clientId: string;
            clientIdType: string;
            service: string[];
            status: 'pending' | 'accepted' | 'rejected';
            createdDate: string;
        }>;
    }> {
        try {
            const accessToken = await this.getAccessToken(userId);

            const response = await axios.get(
                `${this.apiUrl}/agents/${agencyId}/invitations`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.hmrc.1.0+json',
                    },
                },
            );

            return {
                invitations: response.data.invitations || [],
            };
        } catch (error: any) {
            if (error.response?.status === 204) {
                // No invitations found
                return { invitations: [] };
            }

            throw new BadRequestException(
                'Failed to retrieve pending invitations from HMRC',
            );
        }
    }
}
