import { Request, Response } from 'express';
import { CreateRoomService } from './create.service';
import { CreateRoomDto } from './create.dto';

export class CreateRoomController {
  private service: CreateRoomService;

  constructor() {
    this.service = new CreateRoomService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const result = await this.service.execute(req.body as CreateRoomDto);

    return res.status(201).json(result);
  }
}
