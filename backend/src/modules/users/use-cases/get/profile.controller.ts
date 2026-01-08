import { Request, Response } from 'express';
import { GetProfileService } from './profile.service';

export class GetProfileController {
  private service: GetProfileService;

  constructor() {
    this.service = new GetProfileService();
  }

  async handle(req: Request, res: Response): Promise<Response> {
    // O userId vem do middleware ensureAuthenticated através do req.user
    const userId = req.user!.id;

    const result = await this.service.execute(userId);

    return res.json(result);
  }
}
