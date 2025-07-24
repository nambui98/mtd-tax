// config/configuration.ts
export default () => ({
    port: parseInt(process.env.PORT!, 10) || 3000,
    database: {
        // host: process.env.DATABASE_HOST || 'localhost',
        // port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
        // username: process.env.DATABASE_USERNAME,
        // password: process.env.DATABASE_PASSWORD,
        // database: process.env.DATABASE_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
    },
    s3: {
        region: process.env.AWS_REGION || 'us-east-1',
        bucket: process.env.AWS_S3_BUCKET,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// config/validation.schema.ts
import { z } from 'zod';

export const validationSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().default(3000),
    //   DATABASE_HOST: z.string(),
    //   DATABASE_PORT: z.coerce.number().default(5432),
    //   DATABASE_USERNAME: z.string(),
    //   DATABASE_PASSWORD: z.string(),
    //   DATABASE_NAME: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default('1d'),
    AWS_REGION: z.string().default('us-east-1'),
    AWS_S3_BUCKET: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
});
