import * as postService from '../services/post.service.js';

const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.user, req.body, req.file);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    // identifier can be an ID or a slug
    const post = await postService.getPostByIdOrSlug(
      req.params.identifier,
      req.user,
    );

    res.status(200).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const result = await postService.getAllPosts(req.query, req.user);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(
      req.params.id,
      req.user,
      req.body,
      req.file,
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: { post },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id, req.user);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const changePostStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: 'Status is required' });
    }

    const post = await postService.changePostStatus(
      req.params.id,
      req.user,
      status,
    );

    res.status(200).json({
      success: true,
      message: `Post ${status} successfully`,
      data: { post },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
  changePostStatus,
};
