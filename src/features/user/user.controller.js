import CustomError from '../../errors/CustomError.js';
import UserRepository from './user.repository.js';
import jwt from 'jsonwebtoken';

export default class UserController {
  // Method to register new user
  constructor() {
    this.userRepo = new UserRepository();
  }

  // Method to Register new
  async signup(req, res, next) {
    const details = req.body;
    try {
      await this.userRepo.signup(details);
      // Send success response to the user
      res.status(201).json({ success: true, message: 'User has been successfully Signed Up!' });
    } catch (err) {
      next(err);
    }
  }

  // Method to login user and send a JWT token
  async signin(req, res, next) {
    const { email, password } = req.body;

    // If the email or password are not provided , throw custom error to send failure response
    if (!email || email.trim().length == 0 || !password || password.trim().length == 0) {
      return next(
        new CustomError('Email address and password must be provided!', 400, {
          requestData: { email, password },
        })
      );
    }

    try {
      // Login user and get user details
      const user = await this.userRepo.signin(email, password);

      // Delete tokens that have expired by default (Not by the server)
      await this.userRepo.deleteExpiredTokens(user);

      const JWT_SECRET = process.env.JWT_SECRET;
      const payload = { userId: user._id };

      // Generate JWT token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      // Extract device info
      const deviceInfo = req.useragent;

      // Add token and device info to user's tokens array
      // This helps while logging out user from all devices
      await this.userRepo.addToken(user, token, deviceInfo);

      res.status(200).json({ success: true, message: 'User logged in successfully!', token });
    } catch (err) {
      next(err);
    }
  }

  // Method to Logout user
  async logout(req, res, next) {
    const userId = req.userId;
    const token = req.headers['authorization'];

    try {
      // Mark the specified token as expired and update the user document
      const expiredToken = await this.userRepo.expireToken(userId, token);

      // Send success response to the user
      res
        .status(201)
        .json({ success: true, message: 'User has been successfully Logged out!', expiredToken });
    } catch (err) {
      next(err);
    }
  }

  // Method to Logout on All devices
  async logoutAll(req, res, next) {
    const userId = req.userId;
    try {
      // Mark the all user tokens as expired and update the user document
      const expiredTokens = await this.userRepo.expireAllUserTokens(userId);

      // Send success response to the user
      res.status(201).json({
        success: true,
        message: 'User has been successfully Logged out from all devices!',
        expiredTokens,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method get all user active sessions
  async getActiveSessions(req, res, next) {
    const userId = req.userId;
    try {
      // Get all user active sessions
      const activeSessions = await this.userRepo.getActiveSessions(userId);

      // Send success response to the user
      res.status(201).json({
        success: true,
        message: 'All user active sessions found!',
        activeSessions,
      });
    } catch (err) {
      next(err);
    }
  }
}
