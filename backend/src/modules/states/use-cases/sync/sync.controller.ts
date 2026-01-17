import { Request, Response, NextFunction } from 'express';
import { SyncStatesService } from './sync.service';
import { ISyncStatesResponse } from './sync.interface';

export class SyncStatesController {
  private syncStatesService: SyncStatesService;

  constructor() {
    this.syncStatesService = new SyncStatesService();
  }

  handle = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const response: ISyncStatesResponse =
        await this.syncStatesService.execute();

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };
}
