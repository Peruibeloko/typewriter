import 'dotenv/config';
import cors from 'cors';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';

const app = express();

if (!process.env.MONGODB_URL) throw Error('MONGODB_URL not set in Environment Variables');

mongoose.connect(process.env.MONGODB_URL);

app.use(express.json());
app.use(
  cors({
    origin: process.env.BLOG_URL ?? '*',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  })
);

if (process.env.VERBOSE === 'true') {
  app.use((req, _res, next) => {
    console.log(
      `[${new Date().toLocaleString('pt-BR')}] `,
      `${req.method} ${req.originalUrl}\n${req.body ? ' Body: \n' : ''}`,
      req.body ?? ''
    );
    next();
  });
}
app.use('/healthcheck', (_req, res) => res.send('OK'));
app.use(routes);

// catch 404
app.use(((req, res, _next) => {
  res.status(404).send(`Error: ${req.originalUrl} not found`);
}) as RequestHandler);

// catch 500
app.use(((err, _req, res, _next) => {
  res.status(500).send(`Error: ${err}`);
}) as ErrorRequestHandler);

const port = process.env.PORT || 9595;
app.listen(port, () => console.log(`Listening on port ${port}`));
