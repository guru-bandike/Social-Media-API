import express from 'express';
import CommentController from './comment.controller.js';

// Create express router instance for handling comments related routes
const commentRouter = express.Router();

// Create comment controller for handling comments related operations
const commentController = new CommentController();

commentRouter.get('/:postId', (req, res, next) => {
  commentController.getByPostId(req, res, next);
}); // Route to get all comments of a specific post

commentRouter.post('/:postId', (req, res, next) => {
  commentController.add(req, res, next);
}); // Route to add a comment on a specific post

commentRouter.put('/:id', (req, res, next) => {
  commentController.update(req, res, next);
}); // Route to update a specific comment of user

commentRouter.delete('/:id', (req, res, next) => {
  commentController.delete(req, res, next);
}); // Route to delete a specific comment of user

export default commentRouter;
