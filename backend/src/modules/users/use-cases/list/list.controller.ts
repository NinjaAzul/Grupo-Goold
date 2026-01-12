import { Request, Response } from 'express';
import { ListUsersService } from './list.service';
import { IListUsersRequest } from './list.interface';

export class ListUsersController {
  private service: ListUsersService;

  constructor() {
    this.service = new ListUsersService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const filters: IListUsersRequest = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      name: req.query.name as string,
      email: req.query.email as string,
      roleId: req.query.roleId ? Number(req.query.roleId) : undefined,
      cityId: req.query.cityId ? Number(req.query.cityId) : undefined,
      active:
        typeof req.query.active === 'string'
          ? req.query.active.toLowerCase() === 'true'
          : undefined,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const result = await this.service.execute(filters);

    return res.json(result);
  }
}
