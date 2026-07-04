import User from '../models/user.model.js';

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

export { registerUser, loginUser };
