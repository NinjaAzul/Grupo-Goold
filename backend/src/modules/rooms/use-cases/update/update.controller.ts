import { Request, Response, NextFunction } from 'express';
import { UpdateRoomService } from './update.service';
import { UpdateRoomDto } from './update.dto';

export class UpdateRoomController {
  private service: UpdateRoomService;

  constructor() {
    this.service = new UpdateRoomService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const roomId = Number(req.params.id);
      const result = await this.service.execute(
        roomId,
        req.body as UpdateRoomDto
      );

      return res.json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }
}
