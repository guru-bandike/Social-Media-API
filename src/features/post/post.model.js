import mongoose from 'mongoose';
import CustomError from '../../errors/CustomError.js';
import { deletePostMedia } from '../../utils/fileStorageHelpers.js';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User Id is required!'],
  },
  mediaUrl: { type: String, required: [true, 'Post media is required!'] },
  caption: { type: String },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'like',
    },
  ],
});

// -------------------------------- Middleware section: Start -------------------------------- //

// Middleware to execute before a document is updated using `findOneAndUpdate` or `findByIdAndUpdate`
postSchema.pre('findOneAndUpdate', async function (next) {
  const targetId = this.getQuery()._id;

  try {
    // Find target post
    const targetPost = await PostModel.findById(targetId);

    // If target post is not found, throw Custom error to send failure response
    if (!targetPost) throw new CustomError('Post not found!', 404, { postId: targetId });

    // Get the update object containing the fields to be updated
    const update = this.getUpdate();

    // Delete post media only while updating with new one
    if (update.$set?.mediaUrl) {
      await deletePostMedia(targetPost.mediaUrl);
    }

    // Proceed to the next middleware
    next();
  } catch (err) {
    next(err);
  }
});

// -------------------------------- Middleware section: End -------------------------------- //

export const PostModel = mongoose.model('post', postSchema);
