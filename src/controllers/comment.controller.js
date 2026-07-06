import * as commentService from '../services/comment.service.js';

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const authorId = req.user.id;

    const comment = await commentService.createComment(
      postId,
      authorId,
      content,
      parentId,
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getPostComments(postId);

    res.status(200).json({
      success: true,
      data: { comments },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    const comment = await commentService.updateComment(id, authorId, content);

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: { comment },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;
    const userRole = req.user.role;

    await commentService.deleteComment(id, authorId, userRole);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { createComment, getPostComments, updateComment, deleteComment };
