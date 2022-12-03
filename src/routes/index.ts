import express from 'express';
import authRoutes from './auth.js';
import postRoutes from './post.js';
import draftRoutes from './draft.js';

const app = express();

app.use('/post', postRoutes);
app.use('/draft', draftRoutes);
app.use('/auth', authRoutes);

export default app;
