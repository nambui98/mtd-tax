/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/common/pipes/zod-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { z, ZodError } from 'zod';
// import { ZodError, ZodSchema } from 'zod/v3';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: z.ZodSchema) {}

    transform(value: unknown) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map(
                    (err) => `${err.path.join('.')}: ${err.message}`,
                );
                throw new BadRequestException({
                    message: 'Validation failed 222',
                    error: messages,
                });
            }
            throw new BadRequestException('Validation failed');
        }
    }
}
