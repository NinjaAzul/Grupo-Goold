import { Request, Response, NextFunction } from 'express';
import { SearchByCEPService } from './search-by-cep.service';
import { ISearchByCEPResponse } from './search-by-cep.interface';

export class SearchByCEPController {
  private searchByCEPService: SearchByCEPService;

  constructor() {
    this.searchByCEPService = new SearchByCEPService();
  }

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { cep } = req.params;

      const response: ISearchByCEPResponse =
        await this.searchByCEPService.execute(cep);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };
}
