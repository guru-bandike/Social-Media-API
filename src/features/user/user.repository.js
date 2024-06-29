import { UserModel } from './user.model.js';
import CustomError from '../../errors/CustomError.js';

export default class UserRepository {
  // Method to register new user
  async signup(details) {
    try {
      await new UserModel(details).save();
    } catch (err) {
      throw err;
    }
  }

  // Method to Login user
  async signin(email, password) {
    try {
      // Find user with email
      const user = await UserModel.findOne({ email });

      // If user not found, throw Custom error to send failure response
      if (!user)
        throw new CustomError('User not found with the provided email address!', 400, { email });

      // Check if the password is valid
      const isPasswordValid = await user.comparePassword(password);

      // If password is valid, return found user
      if (isPasswordValid) return user;
      // Else throw Custom error to send failure response
      else throw new CustomError('Invalid password!', 400, { password });
    } catch (err) {
      throw err;
    }
  }

  // Method to add token to the user's tokens array
  async addToken(userDoc, token, deviceInfo) {
    try {
      const now = new Date();
      // Add new token to the user's tokens array with a default expiry time of 1 hour
      userDoc.tokens.push({
        token,
        createdAt: now,
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      });
      await userDoc.save();
    } catch (err) {
      throw err;
    }
  }

  // Method to expire a specific token
  async expireToken(userId, token) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId, 'tokens.token': token },
        {
          // Remove the expiresAt field
          $unset: { 'tokens.$.expiresAt': '' },
          // Set isExpired to true and set expiredAt to the current date/time
          $set: {
            'tokens.$.isExpired': true,
            'tokens.$.expiredAt': new Date(),
          },
        },
        { new: true }
      );

      // Find the expired token in the updated user document
      const expiredTokenDoc = updatedUser.tokens.find((t) => t.token == token);
      const expiredToken = expiredTokenDoc.toObject();
      // Remove the _id field from the expired token
      delete expiredToken._id;
      return expiredToken;
    } catch (err) {
      // Handle any errors that occur during token expiration
      throw err;
    }
  }

  // Method to expire all user tokens
  async expireAllUserTokens(userId) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          // Remove the expiresAt field for all tokens
          $unset: { 'tokens.$[].expiresAt': '' },
          // Set isExpired to true and set expiredAt to the current date/time for all tokens
          $set: { 'tokens.$[].isExpired': true, 'tokens.$[].expiredAt': new Date() },
        },
        { new: true }
      );

      // Convert tokens to plain objects and remove the _id field from each token
      const tokensDoc = updatedUser.tokens;
      const tokens = tokensDoc.map((token) => {
        const tokenObj = token.toObject();
        delete tokenObj._id;
        return tokenObj;
      });
      return tokens;
    } catch (err) {
      throw err;
    }
  }

  // Method to delete tokens that have expired based on the default expiration time (1 hour after creation)
  async deleteExpiredTokens(userDoc) {
    try {
      const now = new Date();

      // Filter tokens to keep only those that have not expired by default expiry (1 hour)
      userDoc.tokens = userDoc.tokens.filter((t) => {
        // Calculate the token's default expiry date (1 hour after creation)
        const tokenDefaultExpiryDate = new Date(t.createdAt.getTime() + 60 * 60 * 1000);

        // Keep tokens that have not passed the default expiry date
        return now <= tokenDefaultExpiryDate;
      });

      // Save the updated user document
      await userDoc.save();
    } catch (err) {
      throw err;
    }
  }

  // Method to get all user active sessions
  async getActiveSessions(userId) {
    try {
      const user = await UserModel.findById(userId);

      // Filter active sessions
      const activeSessions = user.tokens.filter((t) => !t.isExpired);
      return activeSessions;
    } catch (err) {
      throw err;
    }
  }
}
