import { Request, Response, NextFunction } from 'express';
import { CreateRoomService } from './create.service';
import { CreateRoomDto } from './create.dto';

export class CreateRoomController {
  private service: CreateRoomService;

  constructor() {
    this.service = new CreateRoomService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const result = await this.service.execute(req.body as CreateRoomDto);

      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }
}
