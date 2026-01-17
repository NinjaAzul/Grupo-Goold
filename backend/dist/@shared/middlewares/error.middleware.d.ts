import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, _next: NextFunction) => Response;
//# sourceMappingURL=error.middleware.d.ts.map