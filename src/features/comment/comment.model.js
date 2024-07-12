import mongoose from 'mongoose';
import { PostModel } from '../post/post.model.js';

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User Id is required!'],
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: [true, 'Post Id is required!'],
  },
  content: { type: String, required: [true, 'Comment content is required!'] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'like' }],
});

// -------------------------------- Validators section: Start -------------------------------- //

// validator to ensure post exists
commentSchema.path('postId').validate(async function (postId) {
  return Boolean(await PostModel.findById(postId));
}, 'Invalid target ID!');

// -------------------------------- Validators section: End -------------------------------- //

export const CommentModel = mongoose.model('comment', commentSchema);
