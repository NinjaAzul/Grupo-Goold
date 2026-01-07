import { Router } from 'express';

const healthCheckRoutes = Router();

healthCheckRoutes.get('/', (_req, res) => {
  res.json({ message: 'Hello World' });
});

export { healthCheckRoutes };
