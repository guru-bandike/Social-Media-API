import CustomError from '../errors/CustomError.js';
import logError from '../utils/errorLogger.js';

const handleApplicationLevelErrors = (err, req, res, next) => {
  // If the error is a CustomError, it indicates a known error.
  // Send a response with the specific status code, message, and additional data if available.
  if (err instanceof CustomError) {
    // Construct the response object
    const response = { success: false, message: err.message };

    // Append any additional error-specific data to the response
    Object.assign(response, err.dataObj);

    return res.status(err.statusCode).json(response);
  }
  logError(err)
  // Otherwise, it's an unknown error, so send a response with a generic error message
  res
    .status(500)
    .json({ status: false, message: 'Oops! Something went wrong, Please try again later!' });
};

export default handleApplicationLevelErrors;
