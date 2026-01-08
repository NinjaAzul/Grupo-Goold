import { Request, Response, NextFunction } from 'express';
export declare const validationMiddleware: (dtoClass: new () => object) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validation.middleware.d.ts.map