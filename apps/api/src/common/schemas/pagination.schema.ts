// common/schemas/pagination.schema.ts
import { z } from 'zod';

export const paginationSchema = z.object({
    page: z
        .string()
        .optional()
        .default('1')
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().min(1).positive()),

    limit: z
        .string()
        .optional()
        .default('10')
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().min(1).max(100).positive()),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
