import { Request, Response } from 'express';
import { LoginService } from './login.service';
import { LoginDto } from './login.dto';

export class LoginController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  handle = async (req: Request, res: Response): Promise<Response> => {
    const request: LoginDto = req.body;
    const response = await this.loginService.execute(request);

    return res.status(200).json(response);
  };
}
