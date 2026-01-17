import { Request, Response, NextFunction } from 'express';
import { UpdateUserPermissionService } from './update-permission.service';
import { IUpdateUserPermissionRequest } from './update-permission.interface';
import { UpdateUserPermissionDto } from './update-permission.dto';

export class UpdateUserPermissionController {
  private service: UpdateUserPermissionService;

  constructor() {
    this.service = new UpdateUserPermissionService();
  }

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = Number(req.params.userId);
      const permissionId = Number(req.params.permissionId);
      const dto: UpdateUserPermissionDto = req.body;

      const data: IUpdateUserPermissionRequest = {
        userId,
        permissionId,
        granted: dto.granted,
      };

      const result = await this.service.execute(data);

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}
