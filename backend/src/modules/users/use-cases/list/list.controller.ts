import { Request, Response, NextFunction } from 'express';
import { ListUsersService } from './list.service';
import { ListUsersQueryDto } from './list-query.dto';

export class ListUsersController {
  private service: ListUsersService;

  constructor() {
    this.service = new ListUsersService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const query = req.query as unknown as ListUsersQueryDto;

      const result = await this.service.execute(query);

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
