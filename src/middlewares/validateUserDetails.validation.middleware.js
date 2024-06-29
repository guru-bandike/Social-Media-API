import { body, validationResult } from 'express-validator';
import CustomError from '../errors/CustomError.js';
import { UserModel } from '../features/user/user.model.js';

const validateUserDetails = async (req, res, next) => {
  // Define validation rules
  const rules = [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name should not be empty!')
      .isLength({ min: 3 })
      .withMessage('Name should at least contain 3 characters!'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email should not be empty!')
      .isEmail({ host_whitelist: ['gmail.com'] })
      .withMessage('Only gmails are allowed! Please check your gmail address and try again!')
      .custom(async (email) => {
        const isEmailInUse = await UserModel.isEmailInUse(email);
        if (isEmailInUse) throw new Error('A user already exists with this e-mail address!');
      }),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password should not be empty!')
      .isStrongPassword()
      .withMessage(
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character!'
      ),
    body('gender').toLowerCase().isIn(['male', 'female', 'others']).withMessage('Invalid gender!'),
  ];

  try {
    // Run rules.
    await Promise.all(
      rules.map((rule) => {
        return rule.run(req);
      })
    );

    // Collect validation errors
    const validationErrors = validationResult(req);

    // If there are no validation errors, proceed to the next middleware
    if (validationErrors.isEmpty()) {
      return next();
    }

    /**
     * Otherwise,
     * Pass a custom error to the next() function so that Express's error-handling middleware can detect and handle it appropriately.
     */
    next(
      new CustomError('User validation failed', 400, {
        validationErrors: validationErrors.array().map((e) => e.msg),
        requestData: req.body,
      })
    );
  } catch (err) {
    next(err);
  }
};

export default validateUserDetails;
