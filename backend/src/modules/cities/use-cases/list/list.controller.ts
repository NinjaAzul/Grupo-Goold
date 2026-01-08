import { Request, Response } from 'express';
import { ListCitiesService } from './list.service';
import { IListCitiesResponse } from './list.interface';

export class ListCitiesController {
  private listCitiesService: ListCitiesService;

  constructor() {
    this.listCitiesService = new ListCitiesService();
  }

  handle = async (req: Request, res: Response): Promise<Response> => {
    const stateId = req.query.stateId ? Number(req.query.stateId) : undefined;
    const uf = req.query.uf ? String(req.query.uf).toUpperCase() : undefined;

    const response: IListCitiesResponse = await this.listCitiesService.execute({
      stateId,
      uf,
    });

    return res.status(200).json(response);
  };
}
