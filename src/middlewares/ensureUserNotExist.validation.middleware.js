import UserModel from '../features/user/user.model.js';
import CustomError from '../errors/CustomError.js';

const ensureUserNotExist = (req, res, next) => {
  const userEmail = req.body.email;
  // Check if the user already exist
  const isUserExist = UserModel.isExists(userEmail);

  /**
   * If a user already exists,
   * Pass a custom error to the next() function so that Express's error-handling middleware can detect and handle it appropriately.
   */
  if (isUserExist)
    return next(
      new CustomError(
        'An account with the provided email address already exists! Please use a different email address to SignUp.',
        409,
        { requestData: req.body }
      )
    );

  // If user does not exist, proceed to the next middleware
  next();
};

export default ensureUserNotExist;
