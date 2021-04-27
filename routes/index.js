const express = require('express');
const router = express.Router();
const posts = require('./posts');

const app = express();

router.use(function (req, res, next) {
  console.log(
    `[${new Date().toLocaleString('pt-BR')}] Received ${req.method} ${req.path}${req.params ? ' with parameters' : ''}`,
    req.params
  );
  next();
});

app.use(router);
app.use('/post', posts);

module.exports = app;
