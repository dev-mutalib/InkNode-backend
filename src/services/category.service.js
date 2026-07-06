import Category from '../models/category.model.js';
import Post from '../models/post.model.js';
import { generateUniqueSlug } from '../utils/slug.js';

const createCategory = async (categoryData) => {
  const slug = await generateUniqueSlug(categoryData.name, Category);

  return await Category.create({
    ...categoryData,
    slug,
  });
};

const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 }).lean();
};

const getCategoryByIdOrSlug = async (identifier) => {
  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const category = await Category.findOne(query).lean();

  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const updateCategory = async (categoryId, updateData) => {
 if (updateData.name) {
   updateData.slug = await generateUniqueSlug(updateData.name, Category);
 }
 const category = await Category.findByIdAndUpdate(categoryId, updateData, {
   new: true,
   runValidators: true,
 }).lean();

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

const deleteCategory = async (categoryId) => {
  // Check if any posts are using this category
  const postsCount = await Post.countDocuments({ category: categoryId });

  if (postsCount > 0) {
    throw new Error(
      `Cannot delete category. It is currently assigned to ${postsCount} post(s). Please reassign or delete those posts first.`,
    );
  }

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

export {
  createCategory,
  getAllCategories,
  getCategoryByIdOrSlug,
  updateCategory,
  deleteCategory,
};