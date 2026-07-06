import {
  getUserProfile,
  updateUserAvatar,
  updateUserProfile,
} from '../services/user.service.js';


const getProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await updateUserProfile(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });
    }

    const user = await updateUserAvatar(req.user.id, req.file);

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getProfile, updateProfile, updateAvatar };
