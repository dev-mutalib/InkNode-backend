import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/user.model.js';

async function protect(req, res, next) {
  try {
    let token = req.cookies?.accessToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Your not authorized, no token found',
      });
    }

    const decode = verifyAccessToken(token);
    const user = await User.findById(decode.id).select(
      '-password -refreshToken',
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Not authorized, token failed' });
  }
}

export default protect;
