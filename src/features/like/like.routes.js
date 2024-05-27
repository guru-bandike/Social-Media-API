import express from 'express';
import LikeController from './like.controller.js';
import ensurePostExists from '../../middlewares/ensurePostExists.validation.middleware.js';

// Create express router instance for handling like related routes
const likeRouter = express.Router();
// Create Like controller instance for handling like related operations
const likeController = new LikeController();

likeRouter.get('/toggle/:postId', ensurePostExists, likeController.toggle); // Route to toggle a specific post like status
likeRouter.get('/:postId', ensurePostExists, likeController.getByPostId); // Route to get a specific post likes

export default likeRouter;
