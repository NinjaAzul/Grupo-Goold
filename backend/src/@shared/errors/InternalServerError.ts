import { AppError } from './AppError';

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

export const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
