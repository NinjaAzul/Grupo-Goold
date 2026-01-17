import { Request, Response, NextFunction } from 'express';
import { GetProfileService } from './profile.service';

export class GetProfileController {
  private service: GetProfileService;

  constructor() {
    this.service = new GetProfileService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.id;

      const result = await this.service.execute(userId);

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
