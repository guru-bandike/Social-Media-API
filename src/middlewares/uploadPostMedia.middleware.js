import multer from 'multer';

// Define accepted file types list
const acceptedFileTypes = ['image/', 'audio/', 'video/', 'application/pdf'];

// Define storage cofiguration
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '_') + file.originalname);
  },
});

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

const uploadPostMedia = (req, res, next) => {
  // Create Multer instance with storage configuration and file filter
  const multerInstance = multer({ fileFilter, storage: storageConfig });

  // Handle multipart/form-data upload
  multerInstance.single('media')(req, res, (err) => {
    // If an error occurs, pass it to the next middleware (e.g., Express custom error handler)
    if (err) return next(err);
    // If the form data is successfully uploaded, set isParsingDone to true for further usage
    req.isParsingDone = true;
    next(); // Proceed to the next middleware
  });
};

export default uploadPostMedia;
