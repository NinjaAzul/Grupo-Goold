import { Request, Response, NextFunction } from 'express';
import { UpdateStatusService } from './update-status.service';
import { UpdateStatusDto } from './update-status.dto';

export class UpdateStatusController {
  private service: UpdateStatusService;

  constructor() {
    this.service = new UpdateStatusService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const appointmentId = Number(req.params.id);
      const dto: UpdateStatusDto = req.body;
      const adminUserId = req.user?.id;

      const result = await this.service.execute({
        appointmentId,
        status: dto.status,
        adminUserId,
      });

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
