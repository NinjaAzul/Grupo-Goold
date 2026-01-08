import { Request, Response } from 'express';
import { UpdateStatusService } from './update-status.service';
import { AppointmentStatus } from '@modules/appointments/model/appointment.interface';

export class UpdateStatusController {
  private service: UpdateStatusService;

  constructor() {
    this.service = new UpdateStatusService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const appointmentId = Number(req.params.id);
    const { status } = req.body;

    if (!Object.values(AppointmentStatus).includes(status)) {
      return res.status(400).json({
        error: {
          message: 'Invalid status. Must be: pending, scheduled, or cancelled',
          statusCode: 400,
        },
      });
    }

    const result = await this.service.execute({
      appointmentId,
      status: status as AppointmentStatus,
    });

    return res.json(result);
  }
}
