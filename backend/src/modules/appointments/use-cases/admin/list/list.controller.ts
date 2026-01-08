import { Request, Response } from 'express';
import { ListAppointmentsService } from './list.service';
import { IListAppointmentsRequest } from './list.interface';

export class ListAppointmentsController {
  private service: ListAppointmentsService;

  constructor() {
    this.service = new ListAppointmentsService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const filters: IListAppointmentsRequest = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      name: req.query.name as string,
      room: req.query.room as string,
      status: req.query.status as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const result = await this.service.execute(filters);

    return res.json(result);
  }
}
