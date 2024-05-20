import express from 'express';
import UserController from './user.controller.js';
import ensureUserNotExist from '../../middlewares/ensureUserNotExist.validation.middleware.js';
import validateUserDetails from '../../middlewares/validateUserDetails.validation.middleware.js';
import hashPassword from '../../middlewares/hashPassword.middleware.js';

// Initialize user router to handle user related routes
const userRouter = express.Router();
// Initialize user controller to user related operations
const userController = new UserController();

// Route to register a new user.
userRouter.post(
  '/signup',
  ensureUserNotExist,
  validateUserDetails,
  hashPassword,
  userController.signup
);

// Route to Login user
userRouter.post('/signin', userController.signin);
9;
export default userRouter;
