import { Request, Response, NextFunction } from 'express';
import { UpdateUserService } from './update.service';
import { UpdateUserDto } from './update.dto';

export class UpdateUserController {
  private service: UpdateUserService;

  constructor() {
    this.service = new UpdateUserService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = Number(req.params.id);
      const updateData = req.body as UpdateUserDto;

      const result = await this.service.execute({
        userId,
        ...updateData,
      });

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
