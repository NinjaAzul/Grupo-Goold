import { Request, Response } from 'express';
import { CreateUserService } from './create.service';
import { CreateUserDto } from './create.dto';

export class CreateUserController {
  private createUserService: CreateUserService;

  constructor() {
    this.createUserService = new CreateUserService();
  }

  handle = async (req: Request, res: Response): Promise<Response> => {
    const request: CreateUserDto = req.body;
    const response = await this.createUserService.execute(request);

    return res.status(201).json(response);
  };
}
