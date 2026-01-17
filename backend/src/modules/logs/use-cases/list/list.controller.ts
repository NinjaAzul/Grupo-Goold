import { Request, Response, NextFunction } from 'express';
import { ListLogsService } from './list.service';
import { ListLogsQueryDto } from './list-query.dto';

export class ListLogsController {
  private service: ListLogsService;

  constructor() {
    this.service = new ListLogsService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const query = req.query as unknown as ListLogsQueryDto;

      const result = await this.service.execute(query);

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
