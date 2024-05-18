import CustomError from '../errors/CustomError.js';

const handleErrors = (err, req, res, next) => {
  // If the error is a CustomError
  // then its a known error, so send a response with error specific status code, message and input data if any
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ status: false, message: err.message, inputData: err.inputData });
  }

  // Otherwise, it's an unknown error, so send a response with a generic error message
  res
    .status(500)
    .json({ status: false, message: 'Oops! Something went wrong, Please try again later!' });
};

export default handleErrors;
