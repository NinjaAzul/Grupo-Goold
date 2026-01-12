import { Request, Response } from 'express';
import { ListAppointmentsService } from './list.service';

export class ListAppointmentsController {
  private service: ListAppointmentsService;

  constructor() {
    this.service = new ListAppointmentsService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      });
    }

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const name = req.query.name as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await this.service.execute({
      userId,
      page,
      limit,
      name,
      startDate,
      endDate,
      status,
    });

    return res.json(result);
  }
}

