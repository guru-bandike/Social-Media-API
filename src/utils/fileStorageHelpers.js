import fs from 'fs/promises';
import path from 'path';

/**
 * Deletes post media.
 * @throws Will throw an error if deletion faild.
 */
export const deletePostMedia = async (mediaUrl) => {
  try {
    const filePath = getPath(mediaUrl);
    // Delete the file from the server
    await fs.unlink(filePath);
  } catch (err) {
    throw err;
  }
};

// Helper method to construct media path
const getPath = (mediaUrl) => {
  // Extract the file name from the current mediaUrl
  const fileName = mediaUrl.split('/').pop();

  // Construct the file path to the media file on the server
  const filePath = path.join('uploads', fileName);

  return filePath;
};
