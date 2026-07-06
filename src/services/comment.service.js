import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';

const createComment = async (postId, authorId, content, parentId = null) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error('Post not found');

  // Verify parent comment exists and belongs to the same post (if replying)
  if (parentId) {
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) throw new Error('Parent comment not found');
    if (parentComment.post.toString() !== postId) {
      throw new Error('Parent comment does not belong to this post');
    }
  }

  return await Comment.create({
    content,
    author: authorId,
    post: postId,
    parent: parentId,
  });
};

const getPostComments = async (postId) => {
  // Fetch all comments for the post and populate author details
  const comments = await Comment.find({ post: postId })
    .populate('author', 'username avatar')
    .sort({ createdAt: 1 }) // Oldest first
    .lean();

  // Build a tree structure for nested replies
  const commentMap = {};
  const tree = [];

  // Initialize map and add empty replies array
  comments.forEach((comment) => {
    comment.replies = [];
    commentMap[comment._id] = comment;
  });

  // Group comments into their parents
  comments.forEach((comment) => {
    if (comment.parent && commentMap[comment.parent]) {
      commentMap[comment.parent].replies.push(comment);
    } else {
      tree.push(comment); // Top-level comment
    }
  });

  return tree;
};

const updateComment = async (commentId, authorId, content) => {
  const comment = await Comment.findById(commentId);

  if (!comment) throw new Error('Comment not found');
  if (comment.author.toString() !== authorId) {
    throw new Error('Not authorized to update this comment');
  }

  comment.content = content;
  await comment.save({ validateBeforeSave: false });

  return comment.toObject();
};

const deleteComment = async (commentId, authorId, userRole) => {
  const comment = await Comment.findById(commentId);

  if (!comment) throw new Error('Comment not found');

  const isAuthor = comment.author.toString() === authorId;
  const isAdmin = userRole === 'admin';

  if (!isAuthor && !isAdmin) {
    throw new Error('Not authorized to delete this comment');
  }

  // Delete the comment and any direct replies to it
  await Comment.deleteMany({
    $or: [{ _id: commentId }, { parent: commentId }],
  });
};

export { createComment, getPostComments, updateComment, deleteComment };
