import { Request, Response } from 'express';
import { UpdateUserService } from './update.service';
import { UpdateUserDto } from './update.dto';

export class UpdateUserController {
  private service: UpdateUserService;

  constructor() {
    this.service = new UpdateUserService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const userId = Number(req.params.id);
    const updateData = req.body as UpdateUserDto;

    const result = await this.service.execute({
      userId,
      ...updateData,
    });

    return res.json(result);
  }
}
