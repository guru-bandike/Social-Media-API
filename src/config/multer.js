import multer from 'multer';
import { cloudinaryStorage } from './cloudinary.js';

// Define accepted file types list
const acceptedFileTypes = ['image/', 'audio/', 'video/', 'application/pdf'];

// Define file filter logic
const fileFilter = (req, file, cb) => {
  // Check the uploaded file type with accepted file types
  const isAccepted = acceptedFileTypes.some((fileType) => file.mimetype.startsWith(fileType));

  // If file type is accepted, accept the media file
  if (isAccepted) {
    req.isMediaFileRejected = false; // Append result to the request for further usage
    cb(null, true);
  } else {
    // Otherwise, reject the media file
    req.isMediaFileRejected = true; // Append result to the request for further usage
    cb(null, false);
  }
};

// Create Multer instance with Cloudinary storage and file filter
const multerInstance = multer({ fileFilter, storage: cloudinaryStorage });

export default multerInstance;
