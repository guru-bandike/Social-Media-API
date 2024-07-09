import mongoose from 'mongoose';
import { UserModel } from '../user/user.model.js';
import { PostModel } from '../post/post.model.js';
import CustomError from '../../errors/CustomError.js';

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
});

// -------------------------------- Middleware section: Start -------------------------------- //

// Middleware to Update user and post collections when creating a new Comment document
commentSchema.post('save', async function (savedComment, next) {
  // Only perform the transaction if the comment is newly created
  if (!savedComment.$__.inserting) {
    return next();
  }

  // Create session
  const session = await mongoose.startSession();
  // Start transaction
  session.startTransaction();

  try {
    // Update user document with newly created comment id
    const updatedUser = await UserModel.findByIdAndUpdate(
      savedComment.userId,
      { $push: { comments: savedComment._id } },
      { session, new: true }
    );

    // If user updation failed, throw error to send failure response
    if (!updatedUser) throw new Error('User not found or $Push operation failed!');

    // Update post document with newly created comment id
    const updatedPost = await PostModel.findByIdAndUpdate(
      savedComment.postId,
      { $push: { comments: savedComment._id } },
      { session, new: true }
    );

    // If post updation failed, throw error to send failure response
    if (!updatedPost) throw new Error('Post not found or $Push operation failed!');

    // If all above operations are successful, commit transaction
    await session.commitTransaction();
  } catch (err) {
    // If any error occurs, Abort transaction
    await session.abortTransaction();

    try {
      // Try to delete newly created comment, Because transaction has failed
      const deletedComment = await CommentModel.findByIdAndDelete(savedComment._id);
      if (!deletedComment) throw new Error('Failed to delete comment!');
    } catch (deleteErr) {
      // If comment deletion failed, pass error to the application-level error handler
      return next(deleteErr);
    }

    // Pass the original error to the application-level error handler
    return next(err);
  } finally {
    // Finally end session
    await session.endSession();
  }

  // If the transaction is successful, Proceed to the next middleware
  next();
});

// Middleware to Update user and post collections when deleting a Comment document
commentSchema.pre('findOneAndDelete', async function (next) {
  const targetCommentId = this.getQuery()._id;

  // Create session
  const session = await mongoose.startSession();
  // Start transaction
  session.startTransaction();

  try {
    // Find target comment
    const targetComment = await CommentModel.findById(targetCommentId);

    // If target comment not found, throw error to send failure response
    if (!targetComment)
      throw new CustomError('Comment not found!', 404, { commentId: targetCommentId });

    // Update user document
    const updatedUser = await UserModel.findByIdAndUpdate(
      targetComment.userId,
      { $pull: { comments: targetCommentId } },
      { session, new: true }
    );

    // If user updation failed, throw error to send failure response
    if (!updatedUser) throw new Error('User not found or $Pull operation failed!');

    // Update post document
    const updatedPost = await PostModel.findByIdAndUpdate(
      targetComment.postId,
      { $pull: { comments: targetCommentId } },
      { session, new: true }
    );

    // If post updation failed, throw error to send failure response
    if (!updatedPost) throw new Error('Post not found or $Pull operation failed!');

    // If all above operations are successful, commit transaction
    await session.commitTransaction();
  } catch (err) {
    // If any error occurs, Abort transaction
    await session.abortTransaction();

    // Pass the error to the application-level error handler
    return next(err);
  } finally {
    // Finally end session
    await session.endSession();
  }

  // If the transaction is successful, Proceed to the next middleware
  next();
});

// -------------------------------- Middleware section: End -------------------------------- //

export const CommentModel = mongoose.model('comment', commentSchema);
