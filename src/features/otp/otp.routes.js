import express from 'express';
import OtpController from './otp.controller.js';

// Create express router instance for handling otp related routes
const otpRouter = express.Router();

// Create otp controller instance for handling otp related operations
const otpController = new OtpController();

otpRouter.post('/send', (req, res, next) => {
  otpController.send(req, res, next);
}); // Route to handle send otp request

otpRouter.post('/verify', (req, res, next) => {
  otpController.verify(req, res, next);
}); // Route to handle verify otp request

otpRouter.post('/reset-password', (req, res, next) => {
  otpController.resetPassword(req, res, next);
}); // Route to handle verify otp request

export default otpRouter;
