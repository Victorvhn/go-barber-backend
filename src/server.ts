import 'reflect-metadata';

import express from 'express';
import 'express-async-errors';

import exceptionHandler from './middlewares/exceptionHandler';
import routes from './routes';
import uploadConfig from './config/upload';

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use(exceptionHandler);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');
});
