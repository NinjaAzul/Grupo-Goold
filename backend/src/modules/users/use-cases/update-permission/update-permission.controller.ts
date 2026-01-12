import { Request, Response } from 'express';
import { UpdateUserPermissionService } from './update-permission.service';
import { IUpdateUserPermissionRequest } from './update-permission.interface';

export class UpdateUserPermissionController {
  private service: UpdateUserPermissionService;

  constructor() {
    this.service = new UpdateUserPermissionService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const userId = Number(req.params.userId);
    const permissionId = Number(req.params.permissionId);

    if (isNaN(userId) || isNaN(permissionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID or permission ID',
      });
    }

    // Validar que granted é um boolean
    if (typeof req.body.granted !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'granted must be a boolean',
      });
    }

    const data: IUpdateUserPermissionRequest = {
      userId,
      permissionId,
      granted: req.body.granted,
    };

    const result = await this.service.execute(data);

    return res.json(result);
  }
}
