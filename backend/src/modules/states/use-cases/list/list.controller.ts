import { Request, Response } from 'express';
import { ListStatesService } from './list.service';
import { IListStatesResponse } from './list.interface';

export class ListStatesController {
  private listStatesService: ListStatesService;

  constructor() {
    this.listStatesService = new ListStatesService();
  }

  handle = async (_req: Request, res: Response): Promise<Response> => {
    const response: IListStatesResponse =
      await this.listStatesService.execute();

    return res.status(200).json(response);
  };
}
