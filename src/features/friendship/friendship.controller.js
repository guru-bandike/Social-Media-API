import CustomError from '../../errors/CustomError.js';
import validateMongodbObjectId from '../../utils/validateMongodbObjectId.js';
import FriendshipRepository from './friendship.repository.js';

export default class FriendshipController {
  constructor() {
    this.friendshipRepo = new FriendshipRepository();
  }

  // Method to get user friendships
  async getFriendships(req, res, next) {
    try {
      const userId = req.userId;

      // Find user friendships
      const friendships = await this.friendshipRepo.getFriendships(userId);

      res.status(200).json({
        success: true,
        message: `User's friendships has been successfully found`,
        friendships,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to get any user's friends
  async getFriendsByUserId(req, res, next) {
    try {
      const userId = req.params.userId;

      // Validate user id
      await validateMongodbObjectId(userId, 'user');

      // Get user's friends
      const friends = await this.friendshipRepo.getFriendsByUserId(userId);

      res.status(200).json({
        success: true,
        message: `User's friends has been successfully found`,
        friends,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to get user's sent pending friend requests
  async getSentPendingFriendReqs(req, res, next) {
    try {
      const userId = req.userId;

      // Find User's sent pending requests
      const sentPendingFriendReqs = await this.friendshipRepo.getSentPendingFriendReqs(userId);

      res.status(200).json({
        success: true,
        message: `User's sent pending requests has been successfully found`,
        sentPendingFriendReqs,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to get user's received pending friend requests
  async getReceivedPendingFriendReqs(req, res, next) {
    try {
      const userId = req.userId;

      // Find User's received pending requests
      const receivedPendingFriendReqs = await this.friendshipRepo.getReceivedPendingFriendReqs(
        userId
      );

      res.status(200).json({
        success: true,
        message: `User's received pending requests has been successfully found`,
        receivedPendingFriendReqs,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to respond user's received pending friend requests
  async respondToReceivedPendingFriendReq(req, res, next) {
    try {
      const userId = req.userId;
      const friendshipId = req.params.friendshipId;
      const { status } = req.body;

      // If status not provided, throw a custom error to send failure response
      if (!status || status.toString().trim().length == 0)
        throw new CustomError('Status is required!', 400, { status });

      // Validate friendship ID
      await validateMongodbObjectId(friendshipId, 'friendship');

      const updatedFriendship = await this.friendshipRepo.respondToReceivedPendingFriendReq(
        userId,
        friendshipId,
        status
      );

      res.status(200).json({
        success: true,
        message: `Friend request has been successfully ${status}`,
        updatedFriendship,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to toggle friendship status with specific user
  async toggleFriendship(req, res, next) {
    try {
      const userId = req.userId;
      const targetId = req.params.targetId;

      // Validate target ID
      await validateMongodbObjectId(targetId, 'target');

      // Ensure user not toggling request to himself
      if (userId == targetId)
        throw new CustomError('User cannot toggle request for himself!', 400, { targetId });

      const result = await this.friendshipRepo.toggleFriendship(userId, targetId);

      res.status(200).json({
        success: true,
        message: result.message,
        friendship: result.friendship,
      });
    } catch (err) {
      next(err);
    }
  }
}
