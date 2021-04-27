const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 9595;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(cors());

app.use(routes);

app.use('*', (req, res, next) => {
  console.log(`Received ${req.method} ${req.path} with parameters ${req.params}`);
  next();
});

app.use('/healthcheck', (req, res) => res.send('OK'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// catch 400
app.use((err, req, res, next) => {
  res.status(400).send(`Error: ${res.originUrl} not found`);
  next();
});

// catch 500
app.use((err, req, res, next) => {
  res.status(500).send(`Error: ${err}`);
  next();
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
