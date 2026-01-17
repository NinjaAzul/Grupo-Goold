import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestError } from '@shared/errors';
import { ParsedQs } from 'qs';

export const queryValidationMiddleware = (dtoClass: new () => object) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(dtoClass, req.query);

      const errors: ValidationError[] = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: true,
      });

      if (errors.length > 0) {
        const messages = errors.map((error) => {
          return Object.values(error.constraints || {}).join(', ');
        });

        return next(new BadRequestError(messages.join('; ')));
      }

      req.query = dto as unknown as ParsedQs;
      next();
    } catch (error) {
      return next(error);
    }
  };
};
