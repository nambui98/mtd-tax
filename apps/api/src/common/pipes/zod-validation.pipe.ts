// src/common/pipes/zod-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod/v3';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map(
                    (err) => `${err.path.join('.')}: ${err.message}`,
                );
                throw new BadRequestException({
                    message: 'Validation failed',
                    errors: messages,
                });
            }
            throw new BadRequestException('Validation failed');
        }
    }
}
