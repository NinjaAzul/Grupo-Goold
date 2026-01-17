import { Request, Response, NextFunction } from 'express';
import { DeleteUserService } from './delete.service';

export class DeleteUserController {
  private service: DeleteUserService;

  constructor() {
    this.service = new DeleteUserService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = Number(req.params.id);
      await this.service.execute(userId);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
