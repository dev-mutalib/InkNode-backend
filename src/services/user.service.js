// src/services/user.service.js
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'blog_avatars', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(fileBuffer);
  });
};

// Helper: Extract Cloudinary public_id from URL to delete old images
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const splitUrl = url.split('/upload/');
  if (splitUrl.length < 2) return null;

  // Remove version number (e.g., v1612345678/) and file extension
  const publicId = splitUrl[1].replace(/v\d+\//, '').split('.')[0];
  return publicId;
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  // Build a $set object to avoid overwriting entire nested objects
  const setObject = {};

  for (const [key, value] of Object.entries(updateData)) {
    // Skip forbidden fields
    if (['password', 'role', 'refreshToken'].includes(key)) continue;

    // If the value is a plain object (like socailLinks), flatten it to dot notation
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        setObject[`${key}.${nestedKey}`] = nestedValue;
      }
    } else {
      setObject[key] = value;
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: setObject },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
const updateUserAvatar = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 1. Upload the new avatar first
  const uploadResult = await uploadToCloudinary(file.buffer);
  const newAvatarUrl = uploadResult.secure_url;

  // 2. Only after a successful upload, delete the old avatar (if it existed)
  if (user.avatar) {
    const publicId = getPublicIdFromUrl(user.avatar);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        // Log the error but don’t throw – the new image is already safe
        console.error('Failed to delete old avatar:', err);
      }
    }
  }

  // 3. Update the user’s avatar URL in the database
  user.avatar = newAvatarUrl;
  await user.save({ validateBeforeSave: false });

  return user;
};

export { getUserProfile, updateUserProfile, updateUserAvatar };
