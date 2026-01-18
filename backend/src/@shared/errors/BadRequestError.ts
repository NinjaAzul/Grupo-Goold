import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string = 'Requisição inválida') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export const BAD_REQUEST = 'BAD_REQUEST';
