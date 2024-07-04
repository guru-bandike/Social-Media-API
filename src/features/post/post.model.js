import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User Id is required!'],
  },
  mediaUrl: { type: String, required: [true, 'Post media is required!'] },
  caption: { type: String },
});

export const PostModel = mongoose.model('Post', postSchema);
