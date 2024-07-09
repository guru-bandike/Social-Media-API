import { CommentModel } from './comment.model.js';
import { PostModel } from '../post/post.model.js';
import CustomError from '../../errors/CustomError.js';

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
    try {
      // Find target post
      const targetPost = await PostModel.findById(postId);

      // If target post is not found, throw Custom error to send failure response
      if (!targetPost) throw new CustomError('Post not found!', 404, { postId });

      // Add new comment
      const newComment = CommentModel.create({ userId, postId, content });
      return newComment;
    } catch (err) {
      throw err;
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
    try {
      // Find target comment
      const targetComment = await CommentModel.findById(commentId);

      // If target comment is not found, throw custom error to send failure response
      if (!targetComment) throw new CustomError('Comment not found!', 404, { commentId });

      // If user is not Authorized, throw custom error to send failure response
      if (targetComment.userId != userId)
        throw new CustomError('User not allowd to delete!', 401, { commentId });

      // If user is Authorized, delete and return
      return await CommentModel.findByIdAndDelete(commentId);
    } catch (err) {
      throw err;
    }
  }
}
