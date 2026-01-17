import { Request, Response, NextFunction } from 'express';
import { DeleteRoomService } from './delete.service';

export class DeleteRoomController {
  private service: DeleteRoomService;

  constructor() {
    this.service = new DeleteRoomService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const roomId = Number(req.params.id);
      await this.service.execute(roomId);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}
