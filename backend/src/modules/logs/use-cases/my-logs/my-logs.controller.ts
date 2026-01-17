import { Request, Response, NextFunction } from 'express';
import { ListLogsService } from '../list/list.service';
import { MyLogsQueryDto } from './my-logs-query.dto';

export class MyLogsController {
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
      const userId = req.user!.id;
      const query = req.query as unknown as MyLogsQueryDto;

      const result = await this.service.execute({
        userId,
        ...query,
      });

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
