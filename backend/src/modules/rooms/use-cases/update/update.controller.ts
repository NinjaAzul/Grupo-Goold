import { Request, Response } from 'express';
import { UpdateRoomService } from './update.service';
import { UpdateRoomDto } from './update.dto';

export class UpdateRoomController {
  private service: UpdateRoomService;

  constructor() {
    this.service = new UpdateRoomService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const roomId = Number(req.params.id);
    const result = await this.service.execute(
      roomId,
      req.body as UpdateRoomDto
    );

    return res.json({ success: true, data: result });
  }
}
