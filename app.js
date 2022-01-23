import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import routes from './routes/index';
dotenvConfig();

const app = express();

connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.BLOG_URL);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
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
