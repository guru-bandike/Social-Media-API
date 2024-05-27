import CustomError from '../errors/CustomError.js';

const validateAddPostReq = (req, res, next) => {
  // If the post media file is rejected, throw custom error to send failure response
  if (req.isMediaFileRejected) {
    throw new CustomError('Only images, videos, audio and PDF are allowed!', 400);
  }

  // If the post media is not provided, throw custom error to send failure response
  if (!req.file) {
    throw new CustomError('Post media must be provided!', 400);
  }

  next();
};

export default validateAddPostReq;
