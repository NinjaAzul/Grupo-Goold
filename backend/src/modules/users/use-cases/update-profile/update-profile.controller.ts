import { Request, Response, NextFunction } from 'express';
import { UpdateUserService } from '../update/update.service';
import { UpdateProfileDto } from './update-profile.dto';

export class UpdateProfileController {
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
      const userId = req.user!.id;
      const updateData = req.body as UpdateProfileDto;

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
