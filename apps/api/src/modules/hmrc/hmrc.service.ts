/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { Database } from '@workspace/database';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { hmrcTokensTable } from '@workspace/database/dist/schema';
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
        this.tokenUrl = `${this.baseUrl}/oauth/token`;
        this.apiUrl = this.configService.get<string>('HMRC_API_URL') || '';
    }

    getAuthorizationUrl(state: string): string {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: 'read:vat write:vat',
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
}
