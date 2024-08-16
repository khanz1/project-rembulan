import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logging } from './middlewares/logging';
import router from './apis/api.routes';

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logging);
app.use(router);

export default app;
