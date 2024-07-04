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

// Update user's likes array when saving a new like document
likeSchema.post('save', async function (doc, next) {
  try {
    // Find and update the user document to push the new like _id
    const updatedUser = await UserModel.findByIdAndUpdate(doc.userId, {
      $push: { likes: doc._id },
    });

    // Check if user document was successfully updated
    if (!updatedUser) {
      throw new Error('Failed to update user document with new like.');
    }
  } catch (err) {
    next(err);
  }
});

// Remove deleted like _id from user's likes array when a like document is deleted
likeSchema.post(['findOneAndDelete', 'findByIdAndDelete'], async function (doc, next) {
  try {
    // Check if the document exists before attempting to update the user document
    if (doc) {
      // Find and update the user document to pull the deleted like _id
      const updatedUser = await UserModel.findByIdAndUpdate(doc.userId, {
        $pull: { likes: doc._id },
      });

      // Check if user document was successfully updated
      if (!updatedUser) {
        throw new Error('Failed to remove deleted like from user document.');
      }
    }
  } catch (err) {
    next(err);
  }
});

const LikeModel = mongoose.model('like', likeSchema);

export default LikeModel;
