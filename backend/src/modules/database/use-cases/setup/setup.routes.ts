import { Router } from 'express';
import { SetupController } from './setup.controller';

const router = Router();
const setupController = new SetupController();

router.get(
  '/',
  setupController.handle.bind(setupController)
);

export { router as setupRoutes };
