import { Request, Response } from 'express';
import { ListLogsService } from './list.service';
import { IListLogsRequest } from './list.interface';

export class ListLogsController {
  private service: ListLogsService;

  constructor() {
    this.service = new ListLogsService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const filters: IListLogsRequest = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      userId: req.query.userId ? Number(req.query.userId) : undefined,
      activityType: req.query.activityType as string,
      module: req.query.module as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const result = await this.service.execute(filters);

    return res.json(result);
  }
}
