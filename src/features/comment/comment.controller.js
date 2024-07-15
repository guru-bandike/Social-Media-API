import CustomError from '../../errors/CustomError.js';
import CommentRepository from './comment.repository.js';
import validateMongodbObjectId from '../../utils/validateMongodbObjectId.js';

export default class CommentController {
  constructor() {
    this.CommentRepo = new CommentRepository();
  }

  // Method to get all existing comments of a specific post
  async getByPostId(req, res, next) {
    const postId = req.params.postId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      // Validate post id
      await validateMongodbObjectId(postId, 'post');

      // If page or limit is less than 1, throw Custom error to sent failure message
      if (page < 1 || limit < 1)
        throw new CustomError('page and limit must be positive numbers!', 400, {
          requestData: { page: req.query.page, limit: req.query.limit },
        });

      // Get all post comment using comment model
      const comments = await this.CommentRepo.getByPostId(postId, page, limit);

      // Send success response with all found comments
      res.status(200).json({
        success: true,
        message: 'Post comments has been successfully found',
        comments,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to add new comment on specific post
  async add(req, res, next) {
    const userId = req.userId;
    const postId = req.params.postId;
    const content = req.body.content;

    try {
      // If the requested comment is empty, throw a custom error to send failure response
      if (!content || content.toString().trim().length == 0)
        throw new CustomError('Comment content can not be empty!', 400, { content });

      // Ensure post id is valid
      await validateMongodbObjectId(postId, 'post');

      // Add new comment using comment model
      const addedComment = await this.CommentRepo.add(userId, postId, content);

      // Send success response with newly added comment
      res
        .status(201)
        .json({ success: true, message: 'Comment has been successfully added', addedComment });
    } catch (err) {
      next(err);
    }
  }

  // Method to update a specific existing comment of user
  async update(req, res, next) {
    const userId = req.userId;
    const content = req.body.content;
    const commentId = req.params.id;

    try {
      // Validate comment id
      await validateMongodbObjectId(commentId, 'comment');

      // If the requested comment is empty, throw a custom error to send failure response
      if (!content || content.trim().length == 0)
        throw new CustomError('Comment content can not be empty!', 400, { content });

      // Update existing comment using comment model
      const updatedComment = await this.CommentRepo.update(userId, commentId, content);

      // Send success response with updated comment
      res
        .status(200)
        .json({ success: true, message: 'Comment has been successfully updated', updatedComment });
    } catch (err) {
      next(err);
    }
  }

  // Method to delete a specific comment
  async delete(req, res, next) {
    const userId = req.userId;
    const commentId = req.params.id;

    try {
      // Validate comment id
      await validateMongodbObjectId(commentId, 'comment');

      // Delete existing comment using comment model
      const deletedComment = await this.CommentRepo.delete(userId, commentId);

      // Send success response with deleted comment
      res
        .status(200)
        .json({ success: true, message: 'Comment has been successfully deleted', deletedComment });
    } catch (err) {
      next(err);
    }
  }
}
