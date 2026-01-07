import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export const BAD_REQUEST = 'BAD_REQUEST';
