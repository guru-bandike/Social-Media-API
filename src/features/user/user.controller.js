import UserModel from './user.model.js';
import generateJwtToken from '../../utils/generateJwtToken.helper.js';
import CustomError from '../../errors/CustomError.js';

export default class UserController {
  // Method to register new user
  signup(req, res) {
    const { name, email, password } = req.body;
    UserModel.signup(name, email, password); // Register using user model
    // Send success response to the user
    res.status(201).json({ success: true, message: 'User has been successfully Signed Up!' });
  }

  // Method to login user and send a JWT token
  signin(req, res) {
    const { email, password } = req.body;

    // If the email or password are not provided , throw custom error to send failure response
    if (!email || email.trim().length == 0 || !password || password.trim().length == 0) {
      throw new CustomError('Email address and password must be provided!', 400, {
        email,
        password,
      });
    }

    // Login user and get user details
    const foundUser = UserModel.signin(email, password);

    // Generate JWT token
    const jwtToken = generateJwtToken({ userId: foundUser.id });

    res.status(200).json({ success: true, message: 'User logged in successfully!', jwtToken });
  }
}
