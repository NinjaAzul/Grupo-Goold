import { Request, Response, NextFunction } from 'express';
import { ListAppointmentsService } from './list.service';
import { ListAppointmentsQueryDto } from './list-query.dto';

export class ListAppointmentsController {
  private service: ListAppointmentsService;

  constructor() {
    this.service = new ListAppointmentsService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.id;
      const query = req.query as unknown as ListAppointmentsQueryDto;

      const result = await this.service.execute({
        userId,
        page: query.page || 1,
        limit: query.limit || 10,
        name: query.name,
        startDate: query.startDate,
        endDate: query.endDate,
        status: query.status,
      });

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
