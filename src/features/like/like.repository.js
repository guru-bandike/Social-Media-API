import mongoose from 'mongoose';
import LikeModel from './like.model.js';
import { updateCommentDoc, updatePostDoc, updateUserDoc } from '../../utils/dbHelpers.js';

export default class LikeRepository {
  // Method to toggle like
  async toggle(userId, targetType, targetId) {
    // Create session
    const session = await mongoose.startSession();
    // Start transaction
    session.startTransaction();

    try {
      // Attemp to delete like
      const deletedLike = await this.#remove(userId, targetId, session);

      // If like was deleted, update user and (post or comment accordingly)
      if (deletedLike) {
        // Update user
        await updateUserDoc(userId, 'likes', 'pull', deletedLike._id, session);

        // If like is for post, update post
        if (targetType === 'post')
          await updatePostDoc(deletedLike.targetId, 'likes', 'pull', deletedLike._id, session);
        // Else update comment
        else
          await updateCommentDoc(deletedLike.targetId, 'likes', 'pull', deletedLike._id, session);

        // If all updates has been successful, commit transaction
        await session.commitTransaction();

        return { performedOperation: 'Deletion', deletedLike };
      } else {
        // If like was not deleted, update user and (post or comment accordingly)
        const newLike = await this.#add(userId, targetType, targetId, session);

        // Update user
        await updateUserDoc(userId, 'likes', 'push', newLike._id, session);

        // If like is for post, update post
        if (targetType === 'post')
          await updatePostDoc(newLike.targetId, 'likes', 'push', newLike._id, session);
        // Else update comment
        else await updateCommentDoc(newLike.targetId, 'likes', 'push', newLike._id, session);

        // If all updates has been successful, commit transaction
        await session.commitTransaction();

        return { performedOperation: 'Creation', newLike };
      }
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  // Method to get all target likes
  async getLikes(targetId) {
    try {
      return await LikeModel.find({ targetId });
    } catch (err) {
      throw err;
    }
  }

  // -------------------------------- Private Method Section: Start -------------------------------- //

  // Helper method to add new like
  async #add(userId, targetType, targetId, session) {
    const [newLike] = await LikeModel.create([{ userId, targetType, targetId }], { session });
    return newLike;
  }

  // Helper method to delete existing like
  async #remove(userId, targetId, session) {
    return await LikeModel.findOneAndDelete({ userId, targetId }, { session });
  }
  // -------------------------------- Private Method Section: End -------------------------------- //
}
