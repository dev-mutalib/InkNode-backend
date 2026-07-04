import jwt from 'jsonwebtoken';
import 'dotenv/config';

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, accessSecret, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, refreshSecret, { expiresIn: '7d' });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, accessSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshSecret);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
