import CommentModel from './comment.model.js';
import CustomError from '../../errors/CustomError.js';

export default class CommentController {
  // Method to get all existing comments
  getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // If page or limit is less than 1, throw Custom error to sent failure message
    if (page < 1 || limit < 1)
      throw new CustomError('page and limit must be positive numbers!', 400, {
        requestData: { page: req.query.page, limit: req.query.limit },
      });

    // Get all comment using comment model
    const paginatedComments = CommentModel.getAll(page, limit);

    // Send success response with all comments
    res.status(200).json({
      success: true,
      message: 'Comments has been successfully found',
      paginatedComments,
    });
  }

  // Method to get all existing comments of a specific post
  getPostComments(req, res) {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // If page or limit is less than 1, throw Custom error to sent failure message
    if (page < 1 || limit < 1)
      throw new CustomError('page and limit must be positive numbers!', 400, {
        requestData: { page: req.query.page, limit: req.query.limit },
      });

    // Get all post comment using comment model
    const paginatedComments = CommentModel.getPostComments(postId, page, limit);

    // Send success response with all found comments
    res.status(200).json({
      success: true,
      message: 'Post comments has been successfully found',
      paginatedComments,
    });
  }

  // Method to add new comment on specific post
  add(req, res) {
    const userId = req.userId;
    const postId = parseInt(req.params.postId);
    const comment = req.body.comment;

    // If the requested comment is empty, throw a custom error to send failure response
    if (comment.trim().length == 0)
      throw new CustomError('Comment can not be empty!', 400, { requestedComment: comment });

    // Add new comment using comment model
    const addedComment = CommentModel.add(userId, postId, comment);

    // Send success response with newly added comment
    res
      .status(201)
      .json({ success: true, message: 'Comment has been successfully added', addedComment });
  }

  // Method to update a specific existing comment of user
  update(req, res) {
    const userId = req.userId;
    const comment = req.body.comment;
    const commentId = req.params.commentId;

    // If the requested comment is empty, throw a custom error to send failure response
    if (comment.trim().length == 0)
      throw new CustomError('Comment can not be empty!', 400, { requestedComment: comment });

    // Update existing comment using comment model
    const updatedComment = CommentModel.update(userId, commentId, comment);

    // Send success response with updated comment
    res
      .status(200)
      .json({ success: true, message: 'Comment has been successfully updated', updatedComment });
  }

  // Method to delete a specific comment
  delete(req, res) {
    const userId = req.userId;
    const commentId = req.params.commentId;

    // Delete existing comment using comment model
    const deletedComment = CommentModel.delete(userId, commentId);

    // Send success response with deleted comment
    res
      .status(200)
      .json({ success: true, message: 'Comment has been successfully deleted', deletedComment });
  }
}
