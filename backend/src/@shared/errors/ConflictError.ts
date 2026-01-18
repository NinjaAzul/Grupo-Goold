import { AppError } from './AppError';

export class ConflictError extends AppError {
  constructor(message: string = 'Conflito') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export const CONFLICT = 'CONFLICT';
