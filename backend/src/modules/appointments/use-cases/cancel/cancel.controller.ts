import { Request, Response } from 'express';
import { CancelAppointmentService } from './cancel.service';
import { ForbiddenError, NotFoundError } from '@shared/errors';

export class CancelAppointmentController {
  private service: CancelAppointmentService;

  constructor() {
    this.service = new CancelAppointmentService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const appointmentId = Number(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: {
          message: 'Unauthorized',
          statusCode: 401,
        },
      });
    }

    try {
      const result = await this.service.execute({
        appointmentId,
        userId,
      });

      return res.json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          error: {
            message: error.message,
            statusCode: 404,
          },
        });
      }

      if (error instanceof ForbiddenError) {
        return res.status(403).json({
          error: {
            message: error.message,
            statusCode: 403,
          },
        });
      }

      return res.status(500).json({
        error: {
          message: 'Internal server error',
          statusCode: 500,
        },
      });
    }
  }
}

