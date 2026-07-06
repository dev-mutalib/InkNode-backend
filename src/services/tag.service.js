import Tag from '../models/tag.model.js';
import Post from '../models/post.model.js';
import { generateUniqueSlug } from '../utils/slug.js';

const createTag = async (tagData) => {
  const slug = await generateUniqueSlug(tagData.name, Tag);

  return await Tag.create({
    ...tagData,
    slug,
  });
};

const getAllTags = async () => {
  return await Tag.find().sort({ name: 1 }).lean();
};

const getTagByIdOrSlug = async (identifier) => {
  const query = identifier.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: identifier }
    : { slug: identifier };

  const tag = await Tag.findOne(query).lean();

  if (!tag) {
    throw new Error('Tag not found');
  }

  return tag;
};

const updateTag = async (tagId, updateData) => {
  if (updateData.name) {
    updateData.slug = await generateUniqueSlug(updateData.name, Tag);
  }

  const tag = await Tag.findByIdAndUpdate(tagId, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!tag) {
    throw new Error('Tag not found');
  }

  return tag;
};

const deleteTag = async (tagId) => {
  // Check if any posts are using this tag
  const postsCount = await Post.countDocuments({ tags: tagId });

  if (postsCount > 0) {
    throw new Error(
      `Cannot delete tag. It is currently assigned to ${postsCount} post(s). Please remove it from those posts first.`,
    );
  }

  const tag = await Tag.findByIdAndDelete(tagId);

  if (!tag) {
    throw new Error('Tag not found');
  }

  return tag;
};

export { createTag, getAllTags, getTagByIdOrSlug, updateTag, deleteTag };
