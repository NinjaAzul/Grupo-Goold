import cors from 'cors';
import express, { Application } from 'express';
import { routes } from './http/routes';
import { errorHandler, notFoundHandler } from '../@shared';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
