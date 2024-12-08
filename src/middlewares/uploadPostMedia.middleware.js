import multerInstance from '../config/multer.js';
import { cloudinary } from '../config/cloudinary.js';

// Middleware for uploading files
const uploadPostMedia = (req, res, next) => {
  // Handle multipart/form-data upload
  multerInstance.single('media')(req, res, (err) => {
    if (err) {
      req.isParsingDone = false; // Parsing failed
      return next(err); // Pass error to the next middleware
    }

    // Optimize media url for Better User Experience
    if (req.file) {
      const mediaUrl = cloudinary.url(req.file.filename, { fetch_format: 'auto', quality: 'auto' });
      req.mediaUrl = mediaUrl;
    }

    req.isParsingDone = true; // Parsing was successful
    next(); // Proceed to the next middleware
  });
};

export default uploadPostMedia;
