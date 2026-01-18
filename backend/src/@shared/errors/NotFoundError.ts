import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(message: string = 'Não encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export const NOT_FOUND = 'NOT_FOUND';
