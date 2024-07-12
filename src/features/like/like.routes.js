import express from 'express';
import LikeController from './like.controller.js';

// Create express router instance for handling like related routes
const likeRouter = express.Router();
// Create Like controller instance for handling like related operations
const likeController = new LikeController();

likeRouter.get('/toggle/:id', (req, res, next) => {
  likeController.toggle(req, res, next);
}); // Route to toggle a specific post like status

likeRouter.get('/:id', (req, res, next) => {
  likeController.getlikes(req, res, next);
}); // Route to get a specific post likes

export default likeRouter;
