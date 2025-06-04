import { z } from 'zod';

export const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url(),

    // AWS Cognito
    AWS_REGION: z.string().min(1),
    COGNITO_USER_POOL_ID: z.string().min(1),
    COGNITO_CLIENT_ID: z.string().min(1),
});

export type EnvSchema = z.infer<typeof envSchema>;
