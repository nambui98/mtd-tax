/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    InitiateAuthCommandInput,
    SignUpCommand,
    SignUpCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoService {
    private cognitoClient: CognitoIdentityProviderClient;
    private userPoolId: string;
    private clientId: string;

    constructor(private configService: ConfigService) {
        this.cognitoClient = new CognitoIdentityProviderClient({
            region: this.configService.get<string>('AWS_REGION'),
        });
        this.userPoolId = this.configService.getOrThrow<string>(
            'COGNITO_USER_POOL_ID',
        );
        this.clientId =
            this.configService.getOrThrow<string>('COGNITO_CLIENT_ID');
    }

    async login(username: string, password: string) {
        const params: InitiateAuthCommandInput = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        };

        try {
            const command = new InitiateAuthCommand(params);
            const response = await this.cognitoClient.send(command);
            return {
                accessToken: response.AuthenticationResult?.AccessToken,
                idToken: response.AuthenticationResult?.IdToken,
                refreshToken: response.AuthenticationResult?.RefreshToken,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Authentication failed: ${error.message}`);
            }
            throw new Error('Authentication failed: Unknown error');
        }
    }

    async signup(username: string, password: string, email: string) {
        const params: SignUpCommandInput = {
            ClientId: this.clientId,
            Username: username,
            Password: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
            ],
        };

        try {
            const command = new SignUpCommand(params);
            const response = await this.cognitoClient.send(command);
            return {
                success: true,
                userSub: response.UserSub,
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Signup failed: ${error.message}`);
            }
            throw new Error('Signup failed: Unknown error');
        }
    }

    async verifyOTP(email: string, otp: string) {
        try {
            const command = new ConfirmSignUpCommand({
                ClientId: this.clientId,
                Username: email,
                ConfirmationCode: otp,
            });

            return await this.cognitoClient.send(command);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Verify OTP failed: ${error.message}`);
            }
            throw new Error('Verify OTP failed: Unknown error');
        }
    }

    async signInWithPassword(email: string, password: string) {
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        });
        return await this.cognitoClient.send(command);
    }
}
