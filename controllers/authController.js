import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { authenticator } from 'otplib';
import Allowlist from '../models/allowlistModel.js';
import User from '../models/userModel.js';

export const signup = async (req, res) => {
  const { email } = req.body;

  const queryResult = await Allowlist.findById(email).exec();

  if (!queryResult) return res.status(403).send('User not in allowlist');

  const secret = authenticator.generate();

  User.create({ _id: email, secret, timestamp: Date.now() }, (err, doc) => {
    res.send(err || secret);
  });
};

export const login = async (req, res) => {
  const user = await User.findById(req.body.email).exec();

  if (!user) return res.status(404).send(`No user for email ${user.email} was found`);

  const isTokenValid = authenticator.verify({
    secret: user.secret,
    token: req.body.token
  });

  if (!isTokenValid) return res.status(403).send('Invalid OTP');

  const hash = crypto.createHash('sha256');
  hash.update(`${user.secret}${user.timestamp}`);
  const signingSecret = hash.digest('hex');

  const jwt = jsonwebtoken.sign({ email: user.email }, signingSecret, { expiresIn: '12h' });
  res.send(jwt);
};

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization.replace('Bearer ', '');
  const decodedJWT = JSON.parse(jsonwebtoken.decode(authHeader));

  const user = await User.findById(decodedJWT.email, 'secret timestamp').exec();

  const hash = crypto.createHash('sha256');
  hash.update(`${user.secret}${user.timestamp}`);
  const signingSecret = hash.digest('hex');

  try {
    jsonwebtoken.verify(authHeader, signingSecret);
  } catch (err) {
    return res.status(403).send(err);
  }

  next();
};
