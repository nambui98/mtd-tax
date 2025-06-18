import { z } from 'zod';

export const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url(),

    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1),

    // Mail
    MAIL_HOST: z.string().min(1),
    MAIL_PORT: z.coerce.number(),
    MAIL_SECURE: z.coerce.boolean(),
    MAIL_USER: z.string().min(1),
    MAIL_PASSWORD: z.string().min(1),
    MAIL_FROM_NAME: z.string().min(1),
    MAIL_FROM_ADDRESS: z.string().min(1),

    // HMRC
    HMRC_CLIENT_ID: z.string().min(1),
    HMRC_CLIENT_SECRET: z.string().min(1),
    HMRC_REDIRECT_URI: z.string().min(1),
    HMRC_BASE_URL: z.string().min(1),
    HMRC_API_URL: z.string().min(1),
});

export type EnvSchema = z.infer<typeof envSchema>;
