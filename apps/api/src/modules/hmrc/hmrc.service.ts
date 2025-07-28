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
import { SCOPES } from 'src/config/constants';

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
            scope: SCOPES,
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
                    scope: SCOPES,
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
                    scope: SCOPES,
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

    async getClientAgencyRelationshipByUtr({
        agencyId,
        arn,
        nino,
        service = ['MTD-IT'],
        knownFact,
    }: {
        agencyId: string;
        arn?: string;
        nino: string;
        service?: string[];
        knownFact?: string;
    }): Promise<{
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
            const accessToken = await this.getAccessToken(agencyId);
            let arnParam = arn;
            if (!arn) {
                arnParam = await this.getArn(agencyId);
            }
            // Prepare the request payload
            const requestPayload = {
                service,
                clientIdType: 'ni',
                clientId: nino,
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

            // 204 means relationship is active
            return {
                isAuthorised: true,
                relationship: {
                    service,
                    status: 'active',
                    arn: arnParam ?? '',
                    clientId: nino,
                    clientIdType: 'ni',
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
                        arn: arn ?? '',
                        clientId: nino,
                        clientIdType: 'ni',
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

    async checkAgencyRelationship({
        agencyId,
        arn,
        knownFact,
        nino,
    }: {
        agencyId: string;
        arn?: string;
        knownFact: string;
        nino: string;
    }): Promise<{
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
        let arnParam = arn;
        if (!arn) {
            arnParam = await this.getArn(agencyId);
        }
        try {
            // if (!/^ARN\d+$/.test(agencyId)) {
            //     throw new BadRequestException(
            //         'Invalid agency ID format. Agency ID must start with ARN followed by numbers.',
            //     );
            // }
            // Check relationship using existing method
            const relationship = await this.getClientAgencyRelationshipByUtr({
                agencyId,
                arn: arnParam,
                nino,
                knownFact,
                service: ['MTD-IT'], // Check both services
            });

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
                        arn: arnParam ?? '',
                        clientId: nino,
                        clientIdType: 'ni',
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
                    arn: arnParam ?? '',
                    clientId: nino,
                    clientIdType: 'ni',
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
            console.log('====================================');
            console.log(error);
            console.log('====================================');

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
            throw new BadRequestException(
                `Failed to get pending invitations: ${error.message}`,
            );
        }
    }

    async getClientBusinesses(
        userId: string,
        clientId: string,
        clientIdType: 'ni' | 'utr' = 'utr',
        knownFact: string,
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
            // First, check if we have authorization for this client
            const relationship = await this.checkAgencyRelationship({
                agencyId: userId,
                arn: userArn,
                nino: clientId,
                knownFact,
            });

            if (!relationship.hasRelationship) {
                throw new UnauthorizedException(
                    'No authorization relationship found for this client',
                );
            }

            // Get businesses for the client
            const response = await axios.get(
                `${this.apiUrl}/individuals/business/details/${clientId}/list`,
                {
                    headers: {
                        Accept: 'application/vnd.hmrc.1.0+json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            return {
                businesses: response.data || [],
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
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
        agencyId: string,
        clientId: string,
        businessId: string,
        nino: string,
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
            const accessToken = await this.getAccessToken(agencyId);

            // https://test-api.service.hmrc.gov.uk/individuals/business/details/{nino}/{businessId}
            const response = await axios.get(
                `${this.apiUrl}/individuals/business/details/${nino}/${businessId}`,
                {
                    headers: {
                        Accept: 'application/vnd.hmrc.1.0+json',
                        Authorization: `Bearer ${accessToken}`,
                        'Gov-Test-Scenario': 'DYNAMIC',
                    },
                },
            );
            console.log('====================================');
            console.log(response.data);
            console.log('====================================');

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
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

    async getBusinessIncomeSummary(
        agencyId: string,
        nino: string,
        businessId: string,
        taxYear: string,
        typeOfBusiness: string,
    ): Promise<{
        totalIncome: number;
        totalExpenses: number;
        netProfit: number;
        incomeBreakdown: {
            category: string;
            amount: number;
        }[];
        expenseBreakdown: {
            category: string;
            amount: number;
        }[];
        accountingPeriod: {
            startDate: string;
            endDate: string;
        };
    }> {
        try {
            const accessToken = await this.getAccessToken(agencyId);
            console.log('====================================');
            console.log(
                `${this.apiUrl}/individuals/self-assessment/income-summary/${nino}/${typeOfBusiness}/${taxYear}/${businessId}`,
            );
            console.log('====================================');

            // https://test-api.service.hmrc.gov.uk/individuals/self-assessment/income-summary/{nino}/{typeOfBusiness}/{taxYear}/{businessId}
            // Get business income source summary
            const response = await axios.get(
                `${this.apiUrl}/individuals/self-assessment/income-summary/${nino}/${typeOfBusiness}/${taxYear}/${businessId}`,
                {
                    headers: {
                        Accept: 'application/vnd.hmrc.1.0+json',
                        Authorization: `Bearer ${accessToken}`,
                        'Gov-Test-Scenario': 'N/A - DEFAULT',
                    },
                },
            );

            return {
                totalIncome: response.data.totalIncome || 0,
                totalExpenses: response.data.totalExpenses || 0,
                netProfit: response.data.netProfit || 0,
                incomeBreakdown: response.data.incomeBreakdown || [],
                expenseBreakdown: response.data.expenseBreakdown || [],
                accountingPeriod: response.data.accountingPeriod || {
                    startDate: '',
                    endDate: '',
                },
            };
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    // Return default data if no income summary found
                    return {
                        totalIncome: 0,
                        totalExpenses: 0,
                        netProfit: 0,
                        incomeBreakdown: [],
                        expenseBreakdown: [],
                        accountingPeriod: {
                            startDate: '',
                            endDate: '',
                        },
                    };
                }
            }
            throw new BadRequestException(
                `Failed to get business income summary: ${error.message}`,
            );
        }
    }

    async getBusinessSourceAdjustableSummary(
        agencyId: string,
        nino: string,
        businessId: string,
        taxYear: string,
    ): Promise<{
        bsasId: string;
        accountingPeriod: {
            startDate: string;
            endDate: string;
        };
        totalIncome: number;
        totalExpenses: number;
        netProfit: number;
        adjustments: {
            type: string;
            description: string;
            amount: number;
        }[];
        status: 'draft' | 'submitted' | 'accepted' | 'rejected';
    }> {
        try {
            const accessToken = await this.getAccessToken(agencyId);

            // Get BSAS list first
            const bsasListResponse = await axios.get(
                `${this.apiUrl}/individuals/business/${businessId}/bsas/${taxYear}`,
                {
                    headers: {
                        Accept: 'application/vnd.hmrc.1.0+json',
                        Authorization: `Bearer ${accessToken}`,
                        // 'Gov-Test-Scenario': 'UNSPECIFIED',
                    },
                },
            );

            if (bsasListResponse.data && bsasListResponse.data.length > 0) {
                const latestBsas = bsasListResponse.data[0];

                // Get specific BSAS details
                const bsasResponse = await axios.get(
                    `${this.apiUrl}/individuals/business/${businessId}/bsas/${latestBsas.bsasId}`,
                    {
                        headers: {
                            Accept: 'application/vnd.hmrc.1.0+json',
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );

                return {
                    bsasId: latestBsas.bsasId,
                    accountingPeriod: bsasResponse.data.accountingPeriod,
                    totalIncome: bsasResponse.data.totalIncome || 0,
                    totalExpenses: bsasResponse.data.totalExpenses || 0,
                    netProfit: bsasResponse.data.netProfit || 0,
                    adjustments: bsasResponse.data.adjustments || [],
                    status: bsasResponse.data.status || 'draft',
                };
            }

            // Return default if no BSAS found
            return {
                bsasId: '',
                accountingPeriod: {
                    startDate: '',
                    endDate: '',
                },
                totalIncome: 0,
                totalExpenses: 0,
                netProfit: 0,
                adjustments: [],
                status: 'draft',
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    // Return default data if no BSAS found
                    return {
                        bsasId: '',
                        accountingPeriod: {
                            startDate: '',
                            endDate: '',
                        },
                        totalIncome: 0,
                        totalExpenses: 0,
                        netProfit: 0,
                        adjustments: [],
                        status: 'draft',
                    };
                }
            }
            throw new BadRequestException(
                `Failed to get BSAS: ${error.message}`,
            );
        }
    }

    async getBusinessObligations(
        agencyId: string,
        nino: string,
        businessId: string,
        taxYear: string,
    ): Promise<{
        obligations: Array<{
            obligationId: string;
            obligationType: string;
            dueDate: string;
            status: 'open' | 'fulfilled' | 'overdue';
            periodKey: string;
            startDate: string;
            endDate: string;
        }>;
    }> {
        try {
            const accessToken = await this.getAccessToken(agencyId);

            const response = await axios.get(
                `${this.apiUrl}/individuals/business/${businessId}/obligations/${taxYear}`,
                {
                    headers: {
                        Accept: 'application/vnd.hmrc.1.0+json',
                        Authorization: `Bearer ${accessToken}`,
                        // 'Gov-Test-Scenario': 'UNSPECIFIED',
                    },
                },
            );

            return {
                obligations: response.data.obligations || [],
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    return { obligations: [] };
                }
            }
            throw new BadRequestException(
                `Failed to get business obligations: ${error.message}`,
            );
        }
    }

    async getComprehensiveBusinessInfo(
        agencyId: string,
        clientId: string,
        typeOfBusiness: string,
        businessId: string,
        nino: string,
        taxYear: string = '2024-25',
    ): Promise<{
        businessDetails: any;
        incomeSummary: any;
        bsasData: any;
        obligations: any;
    }> {
        try {
            // Get all business information in parallel
            const [businessDetails, incomeSummary, bsasData, obligations] =
                await Promise.allSettled([
                    this.getClientBusinessDetails(
                        agencyId,
                        clientId,
                        businessId,
                        nino,
                    ),
                    this.getBusinessIncomeSummary(
                        agencyId,
                        nino,
                        businessId,
                        taxYear,
                        typeOfBusiness,
                    ),
                    this.getBusinessSourceAdjustableSummary(
                        agencyId,
                        nino,
                        businessId,
                        taxYear,
                    ),
                    this.getBusinessObligations(
                        agencyId,
                        nino,
                        businessId,
                        taxYear,
                    ),
                ]);

            return {
                businessDetails:
                    businessDetails.status === 'fulfilled'
                        ? businessDetails.value
                        : null,
                incomeSummary:
                    incomeSummary.status === 'fulfilled'
                        ? incomeSummary.value
                        : null,
                bsasData:
                    bsasData.status === 'fulfilled' ? bsasData.value : null,
                obligations:
                    obligations.status === 'fulfilled'
                        ? obligations.value
                        : null,
            };
        } catch (error) {
            console.error('Error getting comprehensive business info:', error);
            throw new BadRequestException(
                `Failed to get comprehensive business information: ${error.message}`,
            );
        }
    }

    async getAllBusinessTypes(): Promise<{
        businessTypes: Array<{
            code: string;
            name: string;
            description: string;
            category: 'self-employment' | 'property' | 'other';
            isActive: boolean;
        }>;
    }> {
        try {
            // HMRC business types based on their API documentation
            const businessTypes = [
                {
                    code: 'self-employment',
                    name: 'Self-Employment',
                    description: 'Self-employed business activities',
                    category: 'self-employment' as const,
                    isActive: true,
                },
                {
                    code: 'uk-property',
                    name: 'UK Property',
                    description: 'UK property rental business',
                    category: 'property' as const,
                    isActive: true,
                },
                {
                    code: 'foreign-property',
                    name: 'Foreign Property',
                    description: 'Foreign property rental business',
                    category: 'property' as const,
                    isActive: true,
                },
                {
                    code: 'furnished-holiday-lets',
                    name: 'Furnished Holiday Lets',
                    description: 'Furnished holiday lettings business',
                    category: 'property' as const,
                    isActive: true,
                },
                {
                    code: 'partnership',
                    name: 'Partnership',
                    description: 'Partnership business activities',
                    category: 'self-employment' as const,
                    isActive: true,
                },
                {
                    code: 'limited-company',
                    name: 'Limited Company',
                    description: 'Limited company business activities',
                    category: 'other' as const,
                    isActive: true,
                },
                {
                    code: 'trust',
                    name: 'Trust',
                    description: 'Trust business activities',
                    category: 'other' as const,
                    isActive: true,
                },
            ];

            return { businessTypes };
        } catch (error) {
            throw new BadRequestException(
                `Failed to get business types: ${error.message}`,
            );
        }
    }

    async getAllClientsBusinesses(userId: string): Promise<{
        clients: Array<{
            clientId: string;
            clientName: string;
            clientType: string;
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
        }>;
    }> {
        try {
            const accessToken = await this.getAccessToken(userId);
            const userArn = await this.getArn(userId);

            // Get all clients from database
            const clients = await this.db
                .select()
                .from(clientsTable)
                .where(eq(clientsTable.createdBy, userId));

            const clientsWithBusinesses = [];

            for (const client of clients) {
                try {
                    // Check if we have authorization for this client
                    if (client.nino) {
                        const relationship = await this.checkAgencyRelationship(
                            {
                                agencyId: userId,
                                arn: userArn,
                                nino: client.nino,
                                knownFact: client.postcode || '',
                            },
                        );
                        if (relationship.hasRelationship) {
                            // Get businesses for this client
                            const businesses = await this.getClientBusinesses(
                                userId,
                                client.nino,
                                'ni',
                                client.postcode || '',
                            );
                            console.log('====================================');
                            console.log(businesses);
                            console.log('====================================');

                            clientsWithBusinesses.push({
                                clientId: client.id,
                                clientName: `${client.firstName} ${client.lastName}`,
                                clientType: client.clientType,
                                businesses: businesses.businesses || [],
                            });
                        } else {
                            // Client exists but no HMRC relationship
                            clientsWithBusinesses.push({
                                clientId: client.id,
                                clientName: `${client.firstName} ${client.lastName}`,
                                clientType: client.clientType,
                                businesses: [],
                            });
                        }
                    } else {
                        // Client exists but no NINO
                        clientsWithBusinesses.push({
                            clientId: client.id,
                            clientName: `${client.firstName} ${client.lastName}`,
                            clientType: client.clientType,
                            businesses: [],
                        });
                    }
                } catch (error) {
                    console.error(
                        `Error getting businesses for client ${client.id}:`,
                        error,
                    );
                    // Add client with empty businesses array if there's an error
                    clientsWithBusinesses.push({
                        clientId: client.id,
                        clientName: `${client.firstName} ${client.lastName}`,
                        clientType: client.clientType,
                        businesses: [],
                    });
                }
            }

            return { clients: clientsWithBusinesses };
        } catch (error) {
            throw new BadRequestException(
                `Failed to get all clients businesses: ${error.message}`,
            );
        }
    }

    async getComprehensiveBusinessInfoForAllUsers(
        userId: string,
        taxYear: string = '2024-25',
    ): Promise<{
        clients: Array<{
            clientId: string;
            clientName: string;
            clientType: string;
            businesses: Array<{
                businessId: string;
                businessName: string;
                businessType: string;
                businessDetails: any;
                incomeSummary: any;
                bsasData: any;
                obligations: any;
            }>;
        }>;
    }> {
        try {
            const accessToken = await this.getAccessToken(userId);
            const userArn = await this.getArn(userId);

            // Get all clients from database
            const clients = await this.db
                .select()
                .from(clientsTable)
                .where(eq(clientsTable.assignedTo, userId));

            const clientsWithComprehensiveInfo = [];

            for (const client of clients) {
                try {
                    if (client.nino) {
                        const relationship = await this.checkAgencyRelationship(
                            {
                                agencyId: userId,
                                arn: userArn,
                                nino: client.nino,
                                knownFact: client.postcode || '',
                            },
                        );

                        if (relationship.hasRelationship) {
                            // Get businesses for this client
                            const businesses = await this.getClientBusinesses(
                                userId,
                                client.nino,
                                'ni',
                                client.postcode || '',
                            );

                            const businessesWithComprehensiveInfo = [];

                            for (const business of businesses.businesses ||
                                []) {
                                try {
                                    const comprehensiveInfo =
                                        await this.getComprehensiveBusinessInfo(
                                            userId,
                                            client.id,
                                            business.businessType,
                                            business.businessId,
                                            client.nino,
                                            taxYear,
                                        );

                                    businessesWithComprehensiveInfo.push({
                                        businessId: business.businessId,
                                        businessName: business.businessName,
                                        businessType: business.businessType,
                                        businessDetails:
                                            comprehensiveInfo.businessDetails,
                                        incomeSummary:
                                            comprehensiveInfo.incomeSummary,
                                        bsasData: comprehensiveInfo.bsasData,
                                        obligations:
                                            comprehensiveInfo.obligations,
                                    });
                                } catch (error) {
                                    console.error(
                                        `Error getting comprehensive info for business ${business.businessId}:`,
                                        error,
                                    );
                                    // Add business with basic info if comprehensive info fails
                                    businessesWithComprehensiveInfo.push({
                                        businessId: business.businessId,
                                        businessName: business.businessName,
                                        businessType: business.businessType,
                                        businessDetails: business,
                                        incomeSummary: null,
                                        bsasData: null,
                                        obligations: null,
                                    });
                                }
                            }

                            clientsWithComprehensiveInfo.push({
                                clientId: client.id,
                                clientName: `${client.firstName} ${client.lastName}`,
                                clientType: client.clientType,
                                businesses: businessesWithComprehensiveInfo,
                            });
                        } else {
                            // Client exists but no HMRC relationship
                            clientsWithComprehensiveInfo.push({
                                clientId: client.id,
                                clientName: `${client.firstName} ${client.lastName}`,
                                clientType: client.clientType,
                                businesses: [],
                            });
                        }
                    } else {
                        // Client exists but no NINO
                        clientsWithComprehensiveInfo.push({
                            clientId: client.id,
                            clientName: `${client.firstName} ${client.lastName}`,
                            clientType: client.clientType,
                            businesses: [],
                        });
                    }
                } catch (error) {
                    console.error(
                        `Error getting comprehensive info for client ${client.id}:`,
                        error,
                    );
                    // Add client with empty businesses array if there's an error
                    clientsWithComprehensiveInfo.push({
                        clientId: client.id,
                        clientName: `${client.firstName} ${client.lastName}`,
                        clientType: client.clientType,
                        businesses: [],
                    });
                }
            }

            return { clients: clientsWithComprehensiveInfo };
        } catch (error) {
            throw new BadRequestException(
                `Failed to get comprehensive business info for all users: ${error.message}`,
            );
        }
    }
}
