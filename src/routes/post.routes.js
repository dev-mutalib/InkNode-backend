import express from 'express';
import {
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  changePostStatus,
} from '../controllers/post.controller.js';
import protect from '../middleware/auth.middleware.js';
import uploadThumbnail from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes (Service handles visibility/draft logic)
router.get('/', getAllPosts);
router.get('/:identifier', getPost);

// Protected routes
router.use(protect);

router.post('/', uploadThumbnail, createPost);
router.patch('/:id', uploadThumbnail, updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/status', changePostStatus);

export default router;
