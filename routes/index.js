import express from 'express';
import auth from './auth.js';
import posts from './post.js';

const app = express();

app.use('/post', posts);
app.use('/auth', auth);

export default app;
