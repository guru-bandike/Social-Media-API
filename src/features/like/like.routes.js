import express from 'express';
import LikeController from './like.controller.js';

// Create express router instance for handling like related routes
const likeRouter = express.Router();
// Create Like controller instance for handling like related operations
const likeController = new LikeController();

likeRouter.get('/all', likeController.getAll); // Route to get all existing likes
likeRouter.get('/toggle/:postId', likeController.toggle); // Route to toggle a specific post like status
likeRouter.get('/:postId', likeController.getByPostId); // Route to get a specific post likes

export default likeRouter;
