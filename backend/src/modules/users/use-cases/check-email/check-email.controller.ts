import { Request, Response, NextFunction } from 'express';
import { CheckEmailService } from './check-email.service';
import { CheckEmailDto } from './check-email.dto';

export class CheckEmailController {
  private checkEmailService: CheckEmailService;

  constructor() {
    this.checkEmailService = new CheckEmailService();
  }

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const request: CheckEmailDto = req.body;
      const response = await this.checkEmailService.execute(request);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };
}
