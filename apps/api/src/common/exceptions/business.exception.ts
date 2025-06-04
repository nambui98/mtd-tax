// common/exceptions/business.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}

export class EntityNotFoundException extends HttpException {
  constructor(entity: string, id: string | number) {
    super(`${entity} with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class ValidationException extends HttpException {
  constructor(errors: string[]) {
    super({
      message: 'Validation failed',
      errors,
    }, HttpStatus.BAD_REQUEST);
  }
}