import User from '../models/user.model.js';
import { generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

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
    throw new Error('Refresh token is requires');
  }

  let decode;
  try {
    decode = verifyRefreshToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }

  const user = User.findById(decode.id).select('+refreshToken');

  if (!user || !user.refreshToken !== refreshToken) {
    throw new Error('Refresh token is invalid or user does not exist ');
  }

  const newAccessToken = generateRefreshToken(user._id);

  return { user, newAccessToken };
};

export { registerUser, refreshAccessToken, loginUser };
