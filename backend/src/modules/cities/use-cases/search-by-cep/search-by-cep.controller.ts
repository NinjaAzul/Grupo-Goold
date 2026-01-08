import { Request, Response } from 'express';
import { SearchByCEPService } from './search-by-cep.service';
import { ISearchByCEPResponse } from './search-by-cep.interface';

export class SearchByCEPController {
  private searchByCEPService: SearchByCEPService;

  constructor() {
    this.searchByCEPService = new SearchByCEPService();
  }

  handle = async (req: Request, res: Response): Promise<Response> => {
    const { cep } = req.params;

    const response: ISearchByCEPResponse =
      await this.searchByCEPService.execute(cep);

    return res.status(200).json(response);
  };
}
