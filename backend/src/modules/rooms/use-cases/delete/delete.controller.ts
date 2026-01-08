import { Request, Response } from 'express';
import { DeleteRoomService } from './delete.service';

export class DeleteRoomController {
  private service: DeleteRoomService;

  constructor() {
    this.service = new DeleteRoomService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const roomId = Number(req.params.id);
    await this.service.execute(roomId);

    return res.status(204).send();
  }
}
