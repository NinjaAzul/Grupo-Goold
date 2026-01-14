import { Request, Response, NextFunction } from 'express';
import { LoginService } from './login.service';
import { LoginDto } from './login.dto';

export class LoginController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const request: LoginDto = req.body;
      const response = await this.loginService.execute(request);

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  };
}
