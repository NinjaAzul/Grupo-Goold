import { Request, Response } from 'express';
import { ListRoomsService } from './list.service';

export class ListRoomsController {
  private service: ListRoomsService;

  constructor() {
    this.service = new ListRoomsService();
  }

  async handle(_req: Request, res: Response): Promise<Response> {
    const rooms = await this.service.execute();

    return res.json({ success: true, data: rooms });
  }
}
