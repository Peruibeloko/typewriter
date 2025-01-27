import { checkAuth } from '@/auth/auth.impl.ts';
import * as impl from '@/posts/post.impl.ts';
import { Hono } from '@hono/hono';

const post = new Hono();

post.get('/', c => {
  const page = Number(c.req.query('page'));
  const size = Number(c.req.query('size'));
  const hasValidBounds = ![isNaN(page), isNaN(size)].includes(true);

  if (!hasValidBounds) {
    c.status(400);
    c.text('Invalid bounds');
  }

  return c.json(impl.getPaginatedPosts(page, size));
});
post.post('/', checkAuth, impl.createPost);

post.get('/count', impl.countPosts);
post.get('/latest', impl.getLatestPostId);
post.get('/first', impl.getFirstPostId);
post.get('/random', impl.getRandomPostId);

post
  .get('/:id', impl.getPostById)
  .patch('/:id', checkAuth, impl.updatePost)
  .delete('/:id', checkAuth, impl.deletePost);

post.get('/:id/next', impl.getNextPostId);
post.get('/:id/prev', impl.getPreviousPostId);

export { post };
