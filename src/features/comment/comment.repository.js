import mongoose from 'mongoose';
import { CommentModel } from './comment.model.js';
import { PostModel } from '../post/post.model.js';
import CustomError from '../../errors/CustomError.js';
import { updateDocument } from '../../utils/dbHelpers.js';

export default class CommentRepository {
  // Method to get comments by post id
  async getByPostId(postId, page, limit) {
    try {
      // Find target post
      const targetPost = await PostModel.findById(postId);

      // If post not found, throw custom error to send failure response
      if (!targetPost) throw new CustomError('Post not found!', 404, { postId });

      const totalComments = targetPost?.comments.length || 0;
      const totalPages = Math.ceil(totalComments / limit);

      // If there are no comments, no need to populate, return empty array response
      if (totalComments == 0)
        return {
          totalComments,
          totalPages: 0,
          currentPage: page,
          paginatedComments: [],
        };

      // If the requested page is greater than total pages, throw custom error to send failure response
      if (page > totalPages)
        throw new CustomError('Invalid page number!', 400, {
          requestedPage: page,
          totalPages,
        });

      // Get comments with pagination
      const comments = (
        await targetPost.populate({
          path: 'comments',
          options: { skip: (page - 1) * limit, limit },
        })
      ).comments;

      return {
        totalComments,
        totalPages,
        currentPage: page,
        paginatedComments: comments,
      };
    } catch (err) {
      throw err;
    }
  }

  // Method to add new comment
  async add(userId, postId, content) {
    // Create session
    const session = await mongoose.startSession();
    // Start transaction
    session.startTransaction();

    try {
      // Add new comment
      const [newComment] = await CommentModel.create([{ userId, postId, content }], { session });

      // Update user(Author) newly created comment ID
      await updateDocument('user', newComment.userId, 'comments', 'push', newComment._id, session);

      // Update corresponding post with newly created comment ID
      await updateDocument('post', newComment.postId, 'comments', 'push', newComment._id, session);

      // If all above operations are successful, commit transaction
      await session.commitTransaction();

      // Return newly created comment to send success response
      return newComment;
    } catch (err) {
      // If any error occurs, Abort transaction
      await session.abortTransaction();

      // Throw error to send failure response
      throw err;
    } finally {
      // Finally end session
      await session.endSession();
    }
  }

  // Method to update existing comment
  async update(userId, commentId, content) {
    try {
      // Find target comment
      const targetComment = await CommentModel.findById(commentId);

      // If target comment is not found, throw custom error to send failure response
      if (!targetComment) throw new CustomError('Comment not found!', 404, { commentId });

      // If user is not Authorized, throw custom error to send failure response
      if (targetComment.userId != userId)
        throw new CustomError('User not allowd to update!', 401, { commentId });

      // Update target comment
      targetComment.content = content;
      targetComment.save();

      return targetComment;
    } catch (err) {
      throw err;
    }
  }

  // Method to delete existing comment
  async delete(userId, commentId) {
    // Create session
    const session = await mongoose.startSession();
    // Start transaction
    session.startTransaction();

    try {
      // Delete target comment
      const deletedComment = await CommentModel.findByIdAndDelete(commentId, { session });

      // If deleted comment is not found, throw custom error to send failure response
      if (!deletedComment) throw new CustomError('Comment not found!', 404, { commentId });

      // If user is not Authorized, throw custom error to send failure response
      if (!deletedComment.userId.equals(userId))
        throw new CustomError('User unauthorized to delete this comment!', 401, { commentId });

      // Update user(Author) deleted comment ID
      await updateDocument(
        'user',
        deletedComment.userId,
        'comments',
        'pull',
        deletedComment._id,
        session
      );

      // Update corresponding post with deleted comment ID
      await updateDocument(
        'post',
        deletedComment.postId,
        'comments',
        'pull',
        deletedComment._id,
        session
      );

      // If all above operations are successful, commit transaction
      await session.commitTransaction();

      // Return deleted comment to send success response
      return deletedComment;
    } catch (err) {
      // If any error occurs, Abort transaction
      await session.abortTransaction();

      // Throw error to send failure response
      throw err;
    } finally {
      // Finally end session
      await session.endSession();
    }
  }
}
