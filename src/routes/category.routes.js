// src/routes/category.routes.js
import express from 'express';
import {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import protect from '../middleware/auth.middleware.js';
import admin from '../middleware/admin.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:identifier', getCategory);

// Admin-only routes
router.post('/', protect, admin, createCategory);
router.patch('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
