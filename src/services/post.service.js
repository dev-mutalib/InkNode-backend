import mongoose from 'mongoose';
import Post from '../models/post.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { calculateReadingTime } from '../utils/readingTime.js';

const createPost = async (user, postData, file) => {
  const slug = await generateUniqueSlug(postData.title, Post);
  const readingTime = calculateReadingTime(postData.content);

  const postDataToSave = {
    ...postData,
    slug,
    readingTime,
    author: user.id,
  };

  if (file) {
    const result = await uploadImage(file.buffer, 'blog_thumbnails');
    postDataToSave.thumbnail = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  return await Post.create(postDataToSave);
};

const getPostByIdOrSlug = async (identifier, currentUser) => {
  // Use Mongoose built-in validation
  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier }
    : { slug: identifier };

  const post = await Post.findOne(query)
    .populate('author', 'username avatar')
    .populate('category', 'name')
    .lean();

  if (!post) throw new Error('Post not found');

  // Permission check for non-published posts
  if (post.status !== 'published') {
    const isAuthor = post.author._id.toString() === currentUser?.id;
    const isAdmin = currentUser?.role === 'admin';
    if (!isAuthor && !isAdmin) {
      throw new Error('You are not authorized to view this post');
    }
  }

  // Atomic view increment
  const shouldIncrement =
    post.status === 'published' &&
    currentUser &&
    post.author._id.toString() !== currentUser.id;

  if (shouldIncrement) {
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
    post.views += 1; // Update local object for response
  }

  return post;
};

const getAllPosts = async (query, currentUser) => {
  // Explicitly convert to numbers
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const filter = {};

  if (!currentUser || currentUser.role !== 'admin') {
    filter.status = 'published';
  }

  if (query.category) filter.category = query.category;
  if (query.tag) filter.tags = { $in: [query.tag] };
  if (query.search) filter.$text = { $search: query.search };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'username avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  return {
    posts,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
};

const updatePost = async (postId, user, updateData, file) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const isAuthor = post.author.toString() === user.id;
  const isAdmin = user.role === 'admin';
  if (!isAuthor && !isAdmin)
    throw new Error('Not authorized to update this post');

  if (updateData.content) {
    updateData.readingTime = calculateReadingTime(updateData.content);
  }

  if (updateData.title) {
    updateData.slug = await generateUniqueSlug(updateData.title, Post);
  }

  // 1. Upload new image FIRST
  let newThumbnail = null;
  if (file) {
    const result = await uploadImage(file.buffer, 'blog_thumbnails');
    newThumbnail = { url: result.secure_url, public_id: result.public_id };
    updateData.thumbnail = newThumbnail;
  }

  // 2. Update Database
  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  // 3. Delete old image AFTER successful DB update (Fault tolerant)
  if (newThumbnail && post.thumbnail && post.thumbnail.public_id) {
    await deleteImage(post.thumbnail.public_id);
  }

  return updatedPost;
};

const deletePost = async (postId, user) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const isAuthor = post.author.toString() === user.id;
  const isAdmin = user.role === 'admin';
  if (!isAuthor && !isAdmin)
    throw new Error('Not authorized to delete this post');

  // Delete from Cloudinary (Fault tolerant)
  if (post.thumbnail && post.thumbnail.public_id) {
    await deleteImage(post.thumbnail.public_id);
  }

  await Post.findByIdAndDelete(postId);
};

const changePostStatus = async (postId, user, status) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  const isAuthor = post.author.toString() === user.id;
  const isAdmin = user.role === 'admin';
  if (!isAuthor && !isAdmin) throw new Error('Not authorized to change status');

  post.status = status;
  await post.save({ validateBeforeSave: false });

  return post.toObject(); // Return plain object
};

export {
  createPost,
  getPostByIdOrSlug,
  getAllPosts,
  updatePost,
  deletePost,
  changePostStatus,
};
