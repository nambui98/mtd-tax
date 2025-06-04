// common/filters/http-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        let details: unknown = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();

            if (typeof errorResponse === 'object') {
                message = (errorResponse as any).message || errorResponse;
                error =
                    (errorResponse as any).error || exception.constructor.name;
                details = (errorResponse as any).details;
            } else {
                message = errorResponse;
            }
        } else if (exception instanceof ZodError) {
            status = HttpStatus.BAD_REQUEST;
            error = 'Validation Error';
            message = 'Invalid request data';
            details = exception.errors;
        } else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;
            details = exception.stack;
        }

        // Log the error with more context
        this.logger.error(
            `${request.method} ${request.url} - ${error}: ${message}`,
            details ||
                (exception instanceof Error ? exception.stack : exception),
        );

        const responseBody: Record<string, unknown> = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message,
        };

        if (details) {
            responseBody.details = details;
        }

        response.status(status).json(responseBody);
    }
}
