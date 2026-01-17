import { Request, Response, NextFunction } from 'express';
import { AdminListAppointmentsService } from './admin-list.service';
import { IAdminListAppointmentsRequest } from './admin-list.interface';

export class AdminListAppointmentsController {
  private service: AdminListAppointmentsService;

  constructor() {
    this.service = new AdminListAppointmentsService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const filters: IAdminListAppointmentsRequest = {
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
    } catch (error) {
      return next(error);
    }
  }
}
