import { Request, Response, NextFunction } from 'express';
import { AvailableRoomsService } from './available-rooms.service';
import { AvailableRoomsQueryDto } from './available-rooms.dto';

export class AvailableRoomsController {
  private service: AvailableRoomsService;

  constructor() {
    this.service = new AvailableRoomsService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const query: AvailableRoomsQueryDto =
        req.query as unknown as AvailableRoomsQueryDto;

      const result = await this.service.execute({
        date: query.date,
        time: query.time,
      });

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
