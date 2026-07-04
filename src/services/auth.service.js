import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const registerUser = async (userData) => {
  const existingUser = await User.findOne({
    $or: [{ email: userData.email }, { username: userData.username }],
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await User.create(userData);
  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }

  let decode;
  try {
    decode = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findById(decode.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('Refresh token is invalid or user does not exist');
  }

  const newAccessToken = generateAccessToken(user._id);

  return { user, newAccessToken };
};

export { registerUser, refreshAccessToken, loginUser };
