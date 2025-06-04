// common/schemas/response.schema.ts
import { z } from 'zod';
import { paginationSchema } from './pagination.schema';

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    statusCode: z.number(),
    message: z.string(),
    data: dataSchema,
    timestamp: z.string(),
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    statusCode: z.number(),
    message: z.string(),
    data: z.array(dataSchema),
    timestamp: z.string(),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Utility functions
export const createApiResponse = <T>(data: T, message = 'Success'): ApiResponse<T> => ({
  success: true,
  statusCode: 200,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const createPaginatedResponse = <T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message = 'Success'
): PaginatedResponse<T> => ({
  success: true,
  statusCode: 200,
  message,
  data,
  timestamp: new Date().toISOString(),
  pagination: {
    ...pagination,
    totalPages: Math.ceil(pagination.total / pagination.limit),
  },
});

// Validation helper
export const validatePagination = (query: unknown) => {
  return paginationSchema.safeParse(query);
};