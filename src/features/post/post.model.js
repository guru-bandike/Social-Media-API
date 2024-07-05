import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User Id is required!'],
  },
  mediaUrl: { type: String, required: [true, 'Post media is required!'] },
  caption: { type: String },
});

// -------------------------------- Middleware section: Start -------------------------------- //

// Middleware to execute before a document is updated using `findOneAndUpdate`
postSchema.pre('findOneAndUpdate', async function (next) {
  try {
    // Get the update object containing the fields to be updated
    const update = this.getUpdate();

    // Find the current document that matches the query
    const post = await this.model.findOne(this.getQuery());

    // Check if the mediaUrl is being updated and is different from the current mediaUrl
    if (post.mediaUrl !== update.$set?.mediaUrl) {
      // Extract the file name from the current mediaUrl
      const fileName = post.mediaUrl.split('/').pop();
      // Construct the file path to the media file on the server
      const filePath = path.join('uploads', fileName);
      // Delete the file from the server
      await fs.unlink(filePath);
    }
    // Proceed to the next middleware or the update operation
    next();
  } catch (err) {
    next(err);
  }
});

// -------------------------------- Middleware section: End -------------------------------- //

export const PostModel = mongoose.model('post', postSchema);
