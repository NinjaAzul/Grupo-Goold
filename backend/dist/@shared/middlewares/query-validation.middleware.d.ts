import { Request, Response, NextFunction } from 'express';
export declare const queryValidationMiddleware: (dtoClass: new () => object) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=query-validation.middleware.d.ts.map