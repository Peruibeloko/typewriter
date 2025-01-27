import { Hono } from '@hono/hono';
import { login, signup, checkAuth } from '@/auth/auth.impl.ts';

const auth = new Hono();

auth.post('/signup', async c => {
  const { email } = await c.req.json<{ email: string }>();
  const secret = await signup(email);
  return c.text(secret);
});

auth.post('/login', login);

auth.get('/check', [checkAuth, ((_req, res) => res.sendStatus(200)) as RequestHandler]);

export { auth };
