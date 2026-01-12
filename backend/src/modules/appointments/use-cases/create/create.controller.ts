import { Request, Response } from 'express';
import { CreateAppointmentService } from './create.service';
import { CreateAppointmentDto } from './create.dto';

export class CreateAppointmentController {
  private service: CreateAppointmentService;

  constructor() {
    this.service = new CreateAppointmentService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      });
    }

    const dto: CreateAppointmentDto = req.body;
    const appointmentDate = new Date(dto.appointmentDate);

    const result = await this.service.execute({
      userId,
      appointmentDate,
      room: dto.room,
    });

    return res.status(201).json(result);
  }
}
