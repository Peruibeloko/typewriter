import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import routes from './routes/index.js';
dotenvConfig();

const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(
  cors({
    origin: process.env.BLOG_URL,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
  })
);

app.use('/healthcheck', (req, res) => res.send('OK'));
app.use(routes);

// catch 404
app.use((err, req, res, next) => {
  res.status(404).send(`Error: ${res.originUrl} not found`);
  next();
});

// catch 500
app.use((err, req, res, next) => {
  res.status(500).send(`Error: ${err}`);
  next();
});

const port = process.env.PORT || 9595;
app.listen(port, () => console.log(`Listening on port ${port}`));
