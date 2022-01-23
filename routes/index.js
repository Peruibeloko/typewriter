import express, { Router } from 'express';
const router = Router();

import posts from './posts';
import auth from './auth';

const app = express();

if (process.env.VERBOSE === 'true') {
  router.use((req, res, next) => {
    console.log(
      `[${new Date().toLocaleString('pt-BR')}] Received ${req.method} ${req.path}${
        req.params ? ' with parameters' : ''
      }`,
      req.params
    );
    next();
  });
}

app.use(router);
app.use('/post', posts);
app.use('/auth', auth);

export default app;
