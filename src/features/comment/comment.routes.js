import express from 'express';
import CommentController from './comment.controller.js';

// Create express router instance for handling comments related routes
const commentRouter = express.Router();
// Create comment controller for handling comments related operations
const commentController = new CommentController();

commentRouter.get('/all', commentController.getAll);
commentRouter.get('/:postId', commentController.getPostComments); // Route to get all comments of a specific post
commentRouter.post('/:postId', commentController.add); // Route to add a comment on a specific post
commentRouter.put('/:commentId', commentController.update); // Route to update a specific comment of user
commentRouter.delete('/:commentId', commentController.delete); // Route to delete a specific comment of user

export default commentRouter;
