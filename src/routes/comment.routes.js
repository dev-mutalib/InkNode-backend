import express from 'express';
import * as commentController from '../controllers/comment.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route: Anyone can read comments
router.get('/posts/:postId', commentController.getPostComments);

// Protected routes: Only authenticated users can add, edit, or delete
router.use(protect);

router.post('/posts/:postId', commentController.createComment);
router.patch('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

export default router;
