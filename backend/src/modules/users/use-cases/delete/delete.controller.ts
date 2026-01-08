import { Request, Response } from 'express';
import { DeleteUserService } from './delete.service';

export class DeleteUserController {
  private service: DeleteUserService;

  constructor() {
    this.service = new DeleteUserService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const userId = Number(req.params.id);
    await this.service.execute(userId);

    return res.status(204).send();
  }
}
