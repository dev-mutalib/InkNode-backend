import express from 'express';
import * as tagController from '../controllers/tag.controller.js';
import  protect from '../middleware/auth.middleware.js';
import  admin  from '../middleware/admin.middleware.js';

const router = express.Router();

// Public routes
router.get('/', tagController.getAllTags);
router.get('/:identifier', tagController.getTag);

// Admin-only routes
router.post('/', protect, admin, tagController.createTag);
router.patch('/:id', protect, admin, tagController.updateTag);
router.delete('/:id', protect, admin, tagController.deleteTag);

export default router;
