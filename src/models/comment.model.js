import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // Null means it's a top-level comment
    },
  },
  { timestamps: true }
);

// Indexes for faster querying
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parent: 1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment