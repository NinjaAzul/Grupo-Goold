import { Request, Response, NextFunction } from 'express';
import { ListCitiesService } from './list.service';
import { IListCitiesResponse } from './list.interface';
import { ListCitiesQueryDto } from './list-query.dto';

export class ListCitiesController {
  private listCitiesService: ListCitiesService;

  constructor() {
    this.listCitiesService = new ListCitiesService();
  }

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const query = req.query as unknown as ListCitiesQueryDto;

      const response: IListCitiesResponse =
        await this.listCitiesService.execute({
          stateId: query.stateId,
          uf: query.uf?.toUpperCase(),
        });

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };
}
