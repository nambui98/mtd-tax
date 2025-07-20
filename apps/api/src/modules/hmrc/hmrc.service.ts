/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import {
    clientsTable,
    hmrcTokensTable,
    usersTable,
} from '@workspace/database/dist/schema';
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
            scope: 'read:check-relationship write:cancel-invitations read:agent-authorisation write:agent-authorisation read:sent-invitations write:sent-invitations',
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
                    scope: 'read:check-relationship write:cancel-invitations read:agent-authorisation write:agent-authorisation read:sent-invitations write:sent-invitations',
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            const { access_token, refresh_token, expires_in } = response.data;
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
                    scope: 'read:check-relationship write:cancel-invitations read:agent-authorisation write:agent-authorisation read:sent-invitations write:sent-invitations',
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
            console.log('====================================1');
            console.log(requestPayload);
            console.log('====================================1');

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
            console.log('vaoooooooooooooooo day : ', response.data);

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

    async requestAgencyRelationship({
        agencyId,
        clientId,
        arn,
        nino,
        knownFact,
    }: {
        agencyId: string;
        clientId: string;
        arn?: string;
        nino: string;
        knownFact: string;
    }): Promise<{
        success: boolean;
        invitationId?: string;
        message: string;
        status: 'pending' | 'accepted' | 'rejected';
    }> {
        try {
            const accessToken = await this.getAccessToken(agencyId);
            let arnParam = arn;
            if (!arn) {
                arnParam = await this.getArn(agencyId);
            }
            // Test ARN exists first
            // try {
            //     const testResponse = await axios.get(
            //         `${this.apiUrl}/agents/${arn}`,
            //         {
            //             headers: {
            //                 Authorization: `Bearer ${accessToken}`,
            //                 Accept: 'application/vnd.hmrc.1.0+json',
            //             },
            //         },
            //     );
            // } catch (testError: any) {
            //     if (testError.response?.status === 404) {
            //         throw new BadRequestException(
            //             `ARN ${arn} not found in HMRC. Please verify your Agent Reference Number.`,
            //         );
            //     }
            //     throw testError;
            // }

            // Prepare the invitation request payload
            const requestPayload = {
                service: ['MTD-IT'],
                clientType: 'personal',
                clientIdType: 'ni',
                clientId: nino,
                knownFact: knownFact,
            };

            console.log('📤 Making invitation request:', {
                url: `${this.apiUrl}/agents/${arnParam}/invitations`,
                payload: requestPayload,
            });

            const response = await axios.post(
                `${this.apiUrl}/agents/${arnParam}/invitations`,
                requestPayload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/vnd.hmrc.1.0+json',
                    },
                },
            );

            // HMRC returns 201 for successful invitation creation
            if (response.status === 204) {
                const invitationId = response.headers?.location
                    ?.split('/')
                    .pop();
                await this.db
                    .update(clientsTable)
                    .set({
                        invitationId,
                    })
                    .where(eq(clientsTable.id, clientId));
                return {
                    success: true,

                    invitationId,
                    message:
                        'Relationship invitation sent successfully. The client will receive a notification to authorize the relationship.',
                    status: 'pending',
                };
            }
            throw new BadRequestException(
                'Failed to send relationship invitation',
            );
        } catch (error: any) {
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
        arn?: string,
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
            const userArn = arn || (await this.getArn(userId));

            const response = await axios.get(
                `${this.apiUrl}/agents/${userArn}/invitations`,
                {
                    headers: {
                        Accept: 'application/vnd.hmrc.1.0+json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            return {
                invitations: response.data.map((invitation: any) => ({
                    ...invitation,
                    invitationId: invitation._links.self.href.split('/').pop(),
                })),
            };
        } catch (error) {
            console.error('Error getting pending invitations:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
            }
            throw new BadRequestException(
                `Failed to get pending invitations: ${error.message}`,
            );
        }
    }

    async getClientBusinesses(
        userId: string,
        clientId: string,
        clientIdType: 'ni' | 'utr' = 'utr',
    ): Promise<{
        businesses: Array<{
            businessId: string;
            businessName: string;
            businessType: string;
            tradingName?: string;
            address: {
                line1: string;
                line2?: string;
                line3?: string;
                line4?: string;
                postcode: string;
                countryCode: string;
            };
            accountingPeriod: {
                startDate: string;
                endDate: string;
            };
            accountingType: string;
            commencementDate: string;
            cessationDate?: string;
            businessDescription?: string;
            emailAddress?: string;
            websiteAddress?: string;
            contactDetails?: {
                phoneNumber?: string;
                mobileNumber?: string;
                faxNumber?: string;
            };
            bankDetails?: {
                accountName: string;
                accountNumber: string;
                sortCode: string;
            };
            industryClassifications?: {
                sicCode?: string;
                sicDescription?: string;
            };
            links: Array<{
                href: string;
                rel: string;
                method: string;
            }>;
        }>;
    }> {
        try {
            const accessToken = await this.getAccessToken(userId);
            const userArn = await this.getArn(userId);

            console.log('Getting businesses for client:', clientId);
            console.log('Client ID type:', clientIdType);
            console.log('ARN:', userArn);
            console.log('Access token present:', !!accessToken);

            // First, check if we have authorization for this client
            const relationship = await this.checkAgencyRelationship(
                userId,
                userArn,
                clientId,
            );

            if (!relationship.hasRelationship) {
                throw new UnauthorizedException(
                    'No authorization relationship found for this client',
                );
            }

            // Get businesses for the client
            const response = await axios.get(
                `${this.apiUrl}/agents/${userArn}/clients/${clientId}/businesses`,
                {
                    headers: {
                        Accept: 'application/vnd.hmrc.1.0+json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            console.log('HMRC Businesses API Response:', response.data);

            return {
                businesses: response.data.businesses || [],
            };
        } catch (error) {
            console.error('Error getting client businesses:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);

                // Handle specific HMRC error codes
                if (error.response?.status === 401) {
                    throw new UnauthorizedException(
                        'HMRC authorization failed',
                    );
                }
                if (error.response?.status === 403) {
                    throw new UnauthorizedException(
                        'Insufficient permissions to access client businesses',
                    );
                }
                if (error.response?.status === 404) {
                    throw new NotFoundException(
                        'Client or businesses not found',
                    );
                }
            }
            throw new BadRequestException(
                `Failed to get client businesses: ${error.message}`,
            );
        }
    }

    async getClientBusinessDetails(
        userId: string,
        clientId: string,
        businessId: string,
    ): Promise<{
        businessId: string;
        businessName: string;
        businessType: string;
        tradingName?: string;
        address: {
            line1: string;
            line2?: string;
            line3?: string;
            line4?: string;
            postcode: string;
            countryCode: string;
        };
        accountingPeriod: {
            startDate: string;
            endDate: string;
        };
        accountingType: string;
        commencementDate: string;
        cessationDate?: string;
        businessDescription?: string;
        emailAddress?: string;
        websiteAddress?: string;
        contactDetails?: {
            phoneNumber?: string;
            mobileNumber?: string;
            faxNumber?: string;
        };
        bankDetails?: {
            accountName: string;
            accountNumber: string;
            sortCode: string;
        };
        industryClassifications?: {
            sicCode?: string;
            sicDescription?: string;
        };
        links: Array<{
            href: string;
            rel: string;
            method: string;
        }>;
    }> {
        try {
            const accessToken = await this.getAccessToken(userId);
            const userArn = await this.getArn(userId);

            console.log('Getting business details for:', businessId);
            console.log('Client ID:', clientId);
            console.log('ARN:', userArn);
            console.log('Access token present:', !!accessToken);

            const response = await axios.get(
                `${this.apiUrl}/agents/${userArn}/clients/${clientId}/businesses/${businessId}`,
                {
                    headers: {
                        Accept: 'application/vnd.hmrc.1.0+json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            console.log('HMRC Business Details API Response:', response.data);

            return response.data;
        } catch (error) {
            console.error('Error getting business details:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);

                if (error.response?.status === 401) {
                    throw new UnauthorizedException(
                        'HMRC authorization failed',
                    );
                }
                if (error.response?.status === 403) {
                    throw new UnauthorizedException(
                        'Insufficient permissions to access business details',
                    );
                }
                if (error.response?.status === 404) {
                    throw new NotFoundException('Business not found');
                }
            }
            throw new BadRequestException(
                `Failed to get business details: ${error.message}`,
            );
        }
    }
}
