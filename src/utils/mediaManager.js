import { cloudinary } from '../config/cloudinary.js';

/**
 * Deletes post media.
 * @throws Will throw an error if deletion faild.
 */
export const deletePostMedia = async (mediaUrl) => {
  try {
    const publicId = extractPublicId(mediaUrl);
    await cloudinary.uploader.destroy(publicId, (err, result) => {
      if (err) throw err;
    });
  } catch (err) {
    throw err;
  }
};

// Helper function to extract Cloudinary public ID from URL
const extractPublicId = (url) => {
  const parts = url.split('/');
  const publicIdWithExtension = parts[parts.length - 2] + '/' + parts[parts.length - 1];
  return publicIdWithExtension.split('.')[0]; // Remove file extension
};
