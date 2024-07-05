import mongoose from 'mongoose';
import { UserModel } from '../user/user.model.js';

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required!'],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'targetType',
    required: [true, 'Target ID is required!'],
  },
  targetType: {
    type: String,
    enum: ['post', 'comment'],
    required: [true, 'Target type is required!'],
    set: (v) => v.toString().toLowerCase(),
  },
});

// -------------------------------- Middleware section: Start -------------------------------- //

// Middleware to Update user's likes array when saving a new like document
likeSchema.post('save', async function (savedLike, next) {
  try {
    // Find and update the user document to push the new like _id
    const updatedUser = await UserModel.findByIdAndUpdate(savedLike.userId, {
      $push: { likes: savedLike._id },
    });

    // Check if user document was successfully updated
    if (!updatedUser) {
      throw new Error('Failed to update user document with new like!');
    }
  } catch (err) {
    next(err);
  }
});

// Middleware to Remove deleted like _id from user's likes array when a like document is deleted
likeSchema.post('findOneAndDelete', async function (deletedLike, next) {
  try {
    // If the deleted document is found then it mean deletion of like was successful
    // Then only update the user document
    if (deletedLike) {
      // Find and update the user document to pull the deleted like _id
      const updatedUser = await UserModel.findByIdAndUpdate(deletedLike.userId, {
        $pull: { likes: deletedLike._id },
      });

      // Check if user document was successfully updated
      if (!updatedUser) {
        throw new Error('Failed to remove deleted like from user document!');
      }
    }
  } catch (err) {
    next(err);
  }
});

// -------------------------------- Middleware section: End -------------------------------- //

const LikeModel = mongoose.model('like', likeSchema);

export default LikeModel;
