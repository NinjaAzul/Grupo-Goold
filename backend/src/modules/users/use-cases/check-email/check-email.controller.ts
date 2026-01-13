import { Request, Response } from 'express';
import { CheckEmailService } from './check-email.service';
import { CheckEmailDto } from './check-email.dto';

export class CheckEmailController {
  private checkEmailService: CheckEmailService;

  constructor() {
    this.checkEmailService = new CheckEmailService();
  }

  handle = async (req: Request, res: Response): Promise<Response> => {
    const request: CheckEmailDto = req.body;
    const response = await this.checkEmailService.execute(request);

    return res.status(200).json(response);
  };
}

