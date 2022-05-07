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

  const user = new User({ _id: email, secret, timestamp: Date.now() });
  try {
    await user.save();
    res.send(secret);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const login = async (req, res) => {
  const user = await User.findById(req.body.email).exec();

  if (!user) return res.status(404).send(`No user for email ${user._id} was found`);

  const isTokenValid = authenticator.check(`${req.body.token}`, user.secret);

  if (!isTokenValid) return res.status(403).send('Invalid OTP');

  const signingSecret = crypto
    .createHash('sha256')
    .update(`${user.secret}${user.timestamp}`)
    .digest('hex');

  const jwt = jsonwebtoken.sign({}, signingSecret, {
    audience: `${user._id}`,
    expiresIn: '12h'
  });

  res.send(jwt);
};

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization?.replace('Bearer ', '');

  if (!authHeader) return res.status(403).send('Missing authentication header');

  const decodedJWT = jsonwebtoken.decode(authHeader);

  if (!decodedJWT) return res.status(403).send('Malformed authentication header');

  const user = await User.findById(decodedJWT.aud, 'secret timestamp').exec();

  if (!user) return res.status(403).send('Unknown user');

  const signingSecret = crypto
    .createHash('sha256')
    .update(`${user.secret}${user.timestamp}`)
    .digest('hex');

  try {
    jsonwebtoken.verify(authHeader, signingSecret);
    next();
  } catch (err) {
    return res.status(403).send(err).end();
  }
};
