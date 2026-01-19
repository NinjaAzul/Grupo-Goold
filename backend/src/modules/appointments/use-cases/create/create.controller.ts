import { Request, Response, NextFunction } from 'express';
import { CreateAppointmentService } from './create.service';
import { CreateAppointmentDto } from './create.dto';
import { DateHelper } from '@shared/utils/date.helper';

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

      const isoString = dto.appointmentDate.endsWith('Z')
        ? dto.appointmentDate
        : dto.appointmentDate + 'Z';

      const appointmentDate = DateHelper.fromISOString(isoString);

      if (isNaN(appointmentDate.getTime())) {
        throw new Error('Data de agendamento inválida');
      }

      const result = await this.service.execute({
        userId,
        appointmentDate,
        roomId: dto.roomId,
      });

      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }
}
