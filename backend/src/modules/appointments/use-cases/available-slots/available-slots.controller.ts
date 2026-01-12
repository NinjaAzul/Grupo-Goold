import { Request, Response } from 'express';
import { AvailableSlotsService } from './available-slots.service';

export class AvailableSlotsController {
  private service: AvailableSlotsService;

  constructor() {
    this.service = new AvailableSlotsService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const date = req.query.date as string;
    const roomId = req.query.roomId
      ? Number(req.query.roomId)
      : undefined;

    if (!date) {
      return res.status(400).json({
        error: {
          message: 'Date parameter is required (YYYY-MM-DD)',
          statusCode: 400,
        },
      });
    }

    const result = await this.service.execute({
      date,
      roomId,
    });

    return res.json(result);
  }
}

