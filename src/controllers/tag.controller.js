import * as tagService from '../services/tag.service.js';

const createTag = async (req, res) => {
  try {
    const tag = await tagService.createTag(req.body);

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: { tag },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await tagService.getAllTags();

    res.status(200).json({
      success: true,
      data: { tags },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTag = async (req, res) => {
  try {
    const tag = await tagService.getTagByIdOrSlug(req.params.identifier);

    res.status(200).json({
      success: true,
      data: { tag },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateTag = async (req, res) => {
  try {
    const tag = await tagService.updateTag(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Tag updated successfully',
      data: { tag },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    await tagService.deleteTag(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { createTag, getAllTags, getTag, updateTag, deleteTag };
