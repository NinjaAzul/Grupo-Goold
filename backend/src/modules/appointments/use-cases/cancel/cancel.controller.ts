import { Request, Response, NextFunction } from 'express';
import { CancelAppointmentService } from './cancel.service';

export class CancelAppointmentController {
  private service: CancelAppointmentService;

  constructor() {
    this.service = new CancelAppointmentService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const appointmentId = Number(req.params.id);
      const userId = req.user!.id;

      const result = await this.service.execute({
        appointmentId,
        userId,
      });

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
