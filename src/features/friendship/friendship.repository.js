import mongoose from 'mongoose';
import CustomError from '../../errors/CustomError.js';
import { UserModel } from '../user/user.model.js';
import { FriendshipModel } from './friendship.model.js';
import { updateDocument } from '../../utils/dbHelpers.js';

export default class FriendshipRepository {
  // Method to get user friendships
  async getFriendships(userId) {
    // Find user
    const user = await UserModel.findById(userId).populate({
      path: 'friendships',
      populate: { path: 'requesterId approverId', select: 'name' },
    });

    // Get user's friendships IDs
    const friendships = user.friendships;

    return friendships;
  }

  // Method to get any user's friends
  async getFriendsByUserId(userId) {
    // Find target user
    const user = await UserModel.findById(userId).populate('friendships');

    // If user not found, throw custom error to send failure message
    if (!user) throw new CustomError('User not found!', 400, { userId });

    // Find user's friendships
    const friendships = user.friendships;

    const friendsIds = [];

    // Find user's friends IDs
    friendships.forEach((f) => {
      if (f.status === 'accepted') {
        if (f.requesterId.equals(userId)) friendsIds.push(f.approverId);
        else friendsIds.push(f.requesterId);
      }
    });

    const friends = [];

    // Find friends with their IDs
    for (const fId of friendsIds) {
      const friend = await UserModel.findById(fId, 'name');
      if (friend) friends.push(friend);
    }

    return friends;
  }

  // Method to get user's sent pending friend requests
  async getSentPendingFriendReqs(userId) {
    try {
      // Find user and his friendships
      const user = await UserModel.findById(userId).populate('friendships');
      const friendships = user.friendships;

      const sentPendingFriendReqs = [];

      // Filter target requests and add them to output array
      for (const f of friendships) {
        if (f.status === 'pending' && f.requesterId.equals(userId)) {
          sentPendingFriendReqs.push(await f.populate('requesterId approverId', 'name'));
        }
      }

      return sentPendingFriendReqs;
    } catch (err) {
      throw err;
    }
  }

  // Method to get user's received pending friend requests
  async getReceivedPendingFriendReqs(userId) {
    try {
      // Find user and his friendships
      const user = await UserModel.findById(userId).populate('friendships');
      const friendships = user.friendships;

      const receivedPendingFriendReqs = [];

      // Filter target requests and add them to output array
      for (const f of friendships) {
        if (f.status === 'pending' && f.approverId.equals(userId)) {
          receivedPendingFriendReqs.push(await f.populate('requesterId approverId', 'name'));
        }
      }

      return receivedPendingFriendReqs;
    } catch (err) {
      throw err;
    }
  }

  // Method to respond user's received pending friend requests
  async respondToReceivedPendingFriendReq(userId, friendshipId, status) {
    try {
      // Find friendship
      const friendship = await FriendshipModel.findById(friendshipId).populate(
        'requesterId approverId',
        'name'
      );

      // If friendship not found, throw custom error to send failure response
      if (!friendship) throw new CustomError('Friend request not found!', 400, { friendshipId });

      // If found friendship is not user's, throw custom error to send failure response
      if (!friendship.requesterId.equals(userId) && !friendship.approverId.equals(userId))
        throw new CustomError(`Friedship is not user's!`, 400, { friendshipId });

      // If user not Authorized to respond, throw custom error to send failure response
      if (!friendship.approverId.equals(userId))
        throw new CustomError(`User sent friend request, can not respond to it!`, 400, {
          friendshipId,
        });

      // Update user preference
      await friendship.set('status', status).save();

      return friendship;
    } catch (err) {
      throw err;
    }
  }

  // Method to toggle friendship status with specific user
  async toggleFriendship(userId, targetId) {
    try {
      // Get user's existing friendships
      const user = await UserModel.findById(userId).populate('friendships');
      const friendships = user.friendships;

      // Find existing friendship involving the target user
      const friendship = friendships.find(
        (f) => f.requesterId.equals(targetId) || f.approverId.equals(targetId)
      );

      // If no existing friendship found, send a new friend request
      if (!friendship) return await this.#sendFriendRequest(userId, targetId);

      // If user has received a friend request before
      if (friendship.approverId.equals(userId)) {
        // If it is pending, accept it
        if (friendship.status === 'pending')
          return await this.#updateFriendRequestStatus(friendship._id, 'accepted');

        // If it is accepted, delete friendship
        if (friendship.status === 'accepted') return await this.#deleteFriendship(friendship);

        // If it is rejected, simulate new friend request with existing friedship
        if (friendship.status === 'rejected')
          return await this.#simulateFriendReqWithExistingFriedship(friendship);

        // If user has sent a friend request before
      } else if (friendship.requesterId.equals(userId)) {
        // If it is pending, withdraw it
        if (friendship.status === 'pending') return await this.#withdrawFriendRequest(friendship);

        // If it is accepted, delete friendship
        if (friendship.status === 'accepted') return await this.#deleteFriendship(friendship);

        // Throw error if user tries to send another request after rejection
        if (friendship.status === 'rejected')
          throw new CustomError('Cannot send another request after rejection!', 400);
      }
    } catch (err) {
      throw err;
    }
  }

  // -------------------------------- Private Method Section: Start -------------------------------- //

  // Helper method to send friend request
  async #sendFriendRequest(requesterId, approverId) {
    // Create session
    const session = await mongoose.startSession();
    // Start transaction
    session.startTransaction();

    try {
      // Create new post
      const [friendship] = await FriendshipModel.create([{ requesterId, approverId }], { session });

      // Update requester
      await updateDocument('user', requesterId, 'friendships', 'push', friendship._id, session);

      // Update aprover
      await updateDocument('user', approverId, 'friendships', 'push', friendship._id, session);

      // If all above operatoins are successful, commit transaction
      await session.commitTransaction();

      return { message: 'Friend request has been successfully sent', friendship };
    } catch (err) {
      // If any error occurs, Abort transaction
      await session.abortTransaction();

      throw err; // Throw error to send failure response
    } finally {
      // Finally end session
      await session.endSession();
    }
  }

  // Helper method to withdraw friend request
  async #withdrawFriendRequest(friendship) {
    await this.#deleteFriendship(friendship);
    return { message: 'Withdraw request successful' };
  }

  // Helper method to delete friendship
  async #deleteFriendship(friendship) {
    // Create session
    const session = await mongoose.startSession();
    // Start transaction
    session.startTransaction();

    try {
      // Delete friendship(Unfriend)
      await FriendshipModel.findByIdAndDelete(friendship._id, { session });

      // Update requester
      await updateDocument(
        'user',
        friendship.requesterId,
        'friendships',
        'pull',
        friendship._id,
        session
      );

      // Update aprover
      await updateDocument(
        'user',
        friendship.approverId,
        'friendships',
        'pull',
        friendship._id,
        session
      );

      // If all above operatoins are successful, commit transaction
      await session.commitTransaction();

      return { message: 'Unfriend successful' };
    } catch (err) {
      // If any error occurs, Abort transaction
      await session.abortTransaction();

      throw err; // Throw error to send failure response
    } finally {
      // Finally end session
      await session.endSession();
    }
  }

  // Helper method to update friend request
  async #updateFriendRequestStatus(friendshipId, status) {
    // update friendship
    const updatedFriendship = await FriendshipModel.findByIdAndUpdate(
      friendshipId,
      { status },
      { new: true }
    );

    // Ensure friendship updation successful
    if (!updatedFriendship) throw new Error('Friendship updation failed!');

    // Define success message
    let message;
    if (status === 'accepted') message = 'Friend request Accepted';
    if (status === 'pending') message = 'Friend request sent';

    return { message, friendship: updatedFriendship };
  }

  // Helper method to simulate new friend request with existing friedship
  async #simulateFriendReqWithExistingFriedship(friendship) {
    // Swap positions
    const temp = friendship.requesterId;
    friendship.requesterId = friendship.approverId;
    friendship.approverId = temp;

    // Update status to pending
    friendship.status = 'pending';

    // save changes
    await friendship.save();

    return { message: 'Friend request has been successfully sent', friendship };
  }

  // -------------------------------- Private Method Section: End -------------------------------- //
}
