import { z } from 'zod';

export const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url(),

    // AWS Cognito
    AWS_REGION: z.string().min(1),
    COGNITO_USER_POOL_ID: z.string().min(1),
    COGNITO_CLIENT_ID: z.string().min(1),

    // Mail
    MAIL_USER: z.string().min(1),
    MAIL_PASSWORD: z.string().min(1),
    MAIL_FROM: z.string(),

    // HMRC
    HMRC_CLIENT_ID: z.string().min(1),
    HMRC_CLIENT_SECRET: z.string().min(1),
    HMRC_REDIRECT_URI: z.string().min(1),
    HMRC_BASE_URL: z.string().min(1),
    HMRC_API_URL: z.string().min(1),
});

export type EnvSchema = z.infer<typeof envSchema>;
