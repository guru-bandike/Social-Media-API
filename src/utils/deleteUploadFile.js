import fs from 'fs/promises';

const deleteUploadedFile = async (fileName) => {
  try {
    const path = './uploads/' + fileName;

    await fs.unlink(path);
  } catch (err) {
    throw err;
  }
};

export default deleteUploadedFile;
