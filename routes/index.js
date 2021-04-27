const express = require('express');
const posts = require('./posts');

const app = express();

app.use('/post', posts);

module.exports = app;
