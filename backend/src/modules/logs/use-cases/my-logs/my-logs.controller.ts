import { Request, Response } from 'express';
import { ListLogsService } from '../list/list.service';

export class MyLogsController {
  private service: ListLogsService;

  constructor() {
    this.service = new ListLogsService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    // O userId vem do middleware ensureAuthenticated através do req.user
    const userId = req.user!.id;

    const filters = {
      userId,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      activityType: req.query.activityType as string,
      module: req.query.module as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const result = await this.service.execute(filters);

    return res.json(result);
  }
}
