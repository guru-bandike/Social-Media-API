import express from 'express';
import UserController from './user.controller.js';
import validateUserDetails from '../../middlewares/validateUserDetails.validation.middleware.js';
import authUser from '../../middlewares/auth-user.middleware.js';

// Initialize user router to handle user related routes
const userRouter = express.Router();

// Initialize user controller to user related operations
const userController = new UserController();

// Route to register a new user.
userRouter.post('/signup', validateUserDetails, (req, res, next) => {
  userController.signup(req, res, next);
});

// Route to Login user
userRouter.post('/signin', (req, res, next) => {
  userController.signin(req, res, next);
});

// Route to Logout user
userRouter.get('/logout', authUser, (req, res, next) => {
  userController.logout(req, res, next);
});

// Route to Logout on all user devices
userRouter.get('/logout-all-devices', authUser, (req, res, next) => {
  userController.logoutAll(req, res, next);
});

// Route to get user active sessions
userRouter.get('/active-sessions', authUser, (req, res, next) => {
  userController.getActiveSessions(req, res, next);
});

export default userRouter;
