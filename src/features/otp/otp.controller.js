import mailer from 'nodemailer';
import CustomError from '../../errors/CustomError.js';
import UserRepository from '../user/user.repository.js';

export default class OtpController {
  constructor() {
    this.userRepo = new UserRepository();
  }

  // Method to send otp to the user
  async send(req, res, next) {
    try {
      const { email } = req.body;

      // Get user
      const user = await this.#getUserWithEmail(email);

      const otp = Math.floor(100000 + Math.random() * 900000); // Generate otp
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Define otp expiration for 10 minutes

      // Update user with otp
      await user.set('otp', { code: otp, expiresAt: otpExpiry }).save();

      // Send otp to the user email
      await this.#sendOtpToEmail(email, otp);

      // Send success response
      res
        .status(200)
        .json({ success: true, message: `OTP has been successfully send to ${email}` });
    } catch (err) {
      next(err);
    }
  }

  // Method to verify otp
  async verify(req, res, next) {
    try {
      const { email, otp: inputOtp } = req.body;

      // Ensure OTP is provided
      if (!inputOtp || inputOtp.toString().trim().length === 0)
        throw new CustomError('OTP must be provided!', { inputOtp });

      // Get user
      const user = await this.#getUserWithEmail(email);

      // Ensure input OTP is valid
      this.#ensureOtpIsValid(user.otp, inputOtp);

      // send success response
      res.status(200).json({ success: true, message: `OTP has been successfully verified` });
    } catch (err) {
      next(err);
    }
  }

  // Method to reset user password with otp verification
  async resetPassword(req, res, next) {
    try {
      const { email, otp: inputOtp, newPassword } = req.body;

      // Ensure password is strong
      this.#ensurePasswordIsStrong(newPassword);

      // Get user
      const user = await this.#getUserWithEmail(email);

      // Ensure input OTP is valid
      this.#ensureOtpIsValid(user.otp, inputOtp);

      // Update user with new password
      await user.set('password', newPassword).save();

      // Send success response
      res
        .status(200)
        .json({ success: true, message: `Password reset has been successfully completed` });
    } catch (err) {
      next(err);
    }
  }

  // -------------------------------- Private Method Section: Start -------------------------------- //

  // Helper method to get user with email
  async #getUserWithEmail(email) {
    // Ensure email is provided
    if (!email || email.trim().length === 0)
      throw new CustomError('Email is required!', 400, { email });

    // Find user
    const user = await this.userRepo.getByEmail(email);

    // If user not found, throw custom error to send failure response
    if (!user) throw new CustomError('User not found with provided email!', 404, { email });

    // If user found, return it
    return user;
  }

  // Helper method to validate OTP
  #ensureOtpIsValid(validOtpObb, inputOtp) {
    const now = Date.now();

    // Ensure user has requested for send OTP before
    if (!validOtpObb || !validOtpObb.expiresAt)
      throw new CustomError('Please first request for send OTP and then try!', 400);

    // Ensure OTP has not expired
    if (now > validOtpObb.expiresAt.getTime()) throw new CustomError('OTP has been expired!', 400);

    // Ensure input OTP is valid
    if (inputOtp != validOtpObb.code) throw new CustomError('Incorrect OTP!', 400, { inputOtp });
  }

  // Helper method to send OTP to the user email
  async #sendOtpToEmail(email, otp) {
    try {
      // Create email transporter
      const transporter = mailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_ADDRESS, pass: process.env.GMAIL_PAAKEY },
      });

      // Define email options
      const mailOptions = {
        from: process.env.GMAIL_ADDRESS,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
      };

      // Send email to the user email
      await transporter.sendMail(mailOptions);
    } catch (err) {
      throw err;
    }
  }

  // Helper method to ensure password is strong
  #ensurePasswordIsStrong(password) {
    const strongPasswordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;

    // If password is not strong, throw custom error to send failure response
    if (!strongPasswordRules.test(password))
      throw new CustomError(
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character!',
        400,
        { password }
      );
  }

  // -------------------------------- Private Method Section: End -------------------------------- //
}
