const express = require('express');
const router = require('express').Router();
const posts = require('./posts');

const app = express();

router.all('*', (req, res, next) => {
  console.log(
    `Received ${req.method} ${req.path}${req.params ? ' with parameters ' : ''}`,
    req.params
  );
  next();
});

app.use('/post', posts);

module.exports = app;
