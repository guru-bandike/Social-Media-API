import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import CustomError from '../../errors/CustomError.js';

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
      // Extract the file name from the current mediaUrl
      const fileName = targetPost.mediaUrl.split('/').pop();

      // Construct the file path to the media file on the server
      const filePath = path.join('uploads', fileName);

      // Delete the file from the server
      await fs.unlink(filePath);
    }

    // Proceed to the next middleware
    next();
  } catch (err) {
    next(err);
  }
});

// -------------------------------- Middleware section: End -------------------------------- //

export const PostModel = mongoose.model('post', postSchema);
