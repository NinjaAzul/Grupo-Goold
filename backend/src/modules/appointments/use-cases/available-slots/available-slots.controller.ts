import { Request, Response, NextFunction } from 'express';
import { AvailableSlotsService } from './available-slots.service';
import { AvailableSlotsQueryDto } from './available-slots.dto';

export class AvailableSlotsController {
  private service: AvailableSlotsService;

  constructor() {
    this.service = new AvailableSlotsService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const query: AvailableSlotsQueryDto =
        req.query as unknown as AvailableSlotsQueryDto;

      const result = await this.service.execute({
        date: query.date,
        roomId: query.roomId,
      });

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
