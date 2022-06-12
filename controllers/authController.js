import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { authenticator } from 'otplib';
import Allowlist from '../models/allowlistModel.js';
import User from '../models/userModel.js';

export const signup = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send('Missing user email');

  const queryResult = await Allowlist.findById(email).exec();

  if (!queryResult) return res.status(403).send('User not in allowlist');
  if (queryResult.isRegistered) return res.status(409).send('User already registered');

  await Allowlist.findByIdAndUpdate(email, { isRegistered: true }).exec();

  const secret = authenticator.generateSecret();

  const user = new User({ _id: email, secret, creationDate: Date.now() });
  try {
    await user.save();
    res.status(201).send(secret);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const login = async (req, res) => {
  const user = await User.findById(req.body.email).exec();

  if (!user) return res.status(404).send(`No user for email ${req.body.email} was found`);

  const isTokenValid = authenticator.check(`${req.body.token}`, user.secret);

  if (!isTokenValid) return res.status(400).send('Invalid OTP');

  const signingSecret = crypto
    .createHash('sha256')
    .update(`${user.secret}${user.creationDate}`)
    .digest('hex');

  const jwt = jsonwebtoken.sign({}, signingSecret, {
    audience: `${user._id}`,
    expiresIn: '12h'
  });

  res.status(200).send(jwt);
};

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res
      .status(401)
      .set('WWW-Authenticate', 'Bearer realm="Access to protected resource"')
      .send('Missing authentication header');

  const token = authHeader.split(' ')[1];
  const decodedJWT = jsonwebtoken.decode(token);

  if (!decodedJWT) return res.status(400).send('Malformed authentication header');

  const user = await User.findById(decodedJWT.aud, 'secret creationDate', {
    isRegistered: { $eq: true }
  }).exec();

  if (!user) return res.status(404).send('Unknown user');

  const signingSecret = crypto
    .createHash('sha256')
    .update(`${user.secret}${user.creationDate}`)
    .digest('hex');

  try {
    req.userInfo = jsonwebtoken.verify(token, signingSecret);
    next();
  } catch (err) {
    return res.status(400).send('JWT signature invalid');
  }
};
