import { Request, Response, NextFunction } from 'express';
import { ListRoomsService } from './list.service';

export class ListRoomsController {
  private service: ListRoomsService;

  constructor() {
    this.service = new ListRoomsService();
  }

  async handle(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const rooms = await this.service.execute();

      return res.json({ success: true, data: rooms });
    } catch (error) {
      return next(error);
    }
  }
}
