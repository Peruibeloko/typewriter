import { unthrow } from '@/utils.ts';
import { encodeBase64 } from '@std/encoding';

export async function signup(email: string) {
  if (!email) {
    return Result.fail({ message: 'Missing user email', code: 400 });
  }

  const queryResult = await Allowlist.findById(email).exec();

  if (!queryResult) return Result.fail({ message: 'User not in allowlist', code: 403 });
  if (queryResult.isRegistered) return new Failiure('User already registered', 409);

  await Allowlist.findByIdAndUpdate(email, { isRegistered: true }).exec();

  const secret = authenticator.generateSecret();

  const user = new User({ _id: email, secret });

  const result = await unthrow(() => user.save());

  if (result instanceof Error) return new Failiure(result.message, 500);
  return;
}

export async function login(req, res): RequestHandler {
  const user = await User.findById(req.body.email).exec();

  if (!user) return res.status(404).send(`No user for email ${req.body.email} was found`);

  const isTokenValid = authenticator.check(`${req.body.token}`, user.secret);

  if (!isTokenValid) return res.status(400).send('Invalid OTP');

  const signingSecret = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${user.secret}${user.createdAt}`)
  );

  const header = encodeBase64(
    JSON.stringify({
      aud: `${user._id}`,
      expiresIn: '12h'
    })
  );

  const body = encodeBase64(JSON.stringify({}));

  crypto.subtle.deriveKey('PBKDF2', signingSecret, 'HMAC');

  const signature = crypto.subtle.sign('HMAC', signingSecret, `${header}.${body}`);

  const jwt = `${header}.${body}.${signature}`;

  res.status(200).send(jwt);
}

export const checkAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res
      .status(401)
      .set('WWW-Authenticate', 'Bearer realm="Access to protected resource"')
      .send('Missing authentication header');

  const token = authHeader.split(' ')[1];
  const decodedJWT = jsonwebtoken.decode(token) as jsonwebtoken.JwtPayload;

  if (!decodedJWT) return res.status(400).send('Malformed authentication header');

  const user = await User.findById(decodedJWT.aud, 'secret createdAt', {
    isRegistered: { $eq: true }
  }).exec();

  if (!user) return res.status(404).send('Unknown user');

  const signingSecret = crypto.createHash('sha256').update(`${user.secret}${user.createdAt}`).digest('hex');

  try {
    const tokenData = jsonwebtoken.verify(token, signingSecret) as jsonwebtoken.JwtPayload;
    req.userInfo = {
      email: tokenData.aud as string
    };
    next();
  } catch (err) {
    return res.status(400).send('JWT signature invalid');
  }
};
