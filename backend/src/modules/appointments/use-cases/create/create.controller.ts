import { Request, Response, NextFunction } from 'express';
import { CreateAppointmentService } from './create.service';
import { CreateAppointmentDto } from './create.dto';

export class CreateAppointmentController {
  private service: CreateAppointmentService;

  constructor() {
    this.service = new CreateAppointmentService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.user!.id;
      const dto: CreateAppointmentDto = req.body;
      const appointmentDate = new Date(dto.appointmentDate);

      const result = await this.service.execute({
        userId,
        appointmentDate,
        room: dto.room,
      });

      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }
}
