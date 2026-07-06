// src/routes/user.routes.js
import express from 'express';
import {
  getProfile,
  updateProfile,
  updateAvatar,
} from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';
import uploadAvatar from '../middleware/upload.middleware.js';

const router = express.Router();

// All user routes are protected
router.use(protect);

router.get('/', getProfile);
router.patch('/profile', updateProfile);
router.patch('/avatar', uploadAvatar, updateAvatar);

export default router;
