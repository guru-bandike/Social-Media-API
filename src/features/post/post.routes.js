import express from 'express';
import PostController from './post.controller.js';
import logRequest from '../../middlewares/logRequest.middleware.js';
import uploadPostMedia from '../../middlewares/uploadPostMedia.middleware.js';
import verifyPostOwnership from '../../middlewares/verifyPostOwnership.validation.middleware.js';
import validateAddPostReq from '../../middlewares/validateAddPostReq.validation.middleware.js';
import validateUpdatePostReq from '../../middlewares/validateUpdatePostReq.validation.middleware.js';

// Create express router instance for handling post related routes
const postRouter = express.Router();
// Create Post controller instance for handling post related operations
const postController = new PostController();

// Define post routes
postRouter.get('/', (req, res, next) => {
  postController.getByUserId(req, res, next);
}); // Route to get all user posts

postRouter.get('/all', (req, res, next) => {
  postController.getAll(req, res, next);
}); // Route to get all existing posts

postRouter.get('/filter', (req, res, next) => {
  postController.filter(req, res, next);
}); // Route to filter and get posts

postRouter.get('/:id', (req, res, next) => {
  postController.getById(req, res, next);
}); // Route to get a specific post

postRouter.post('/', uploadPostMedia, logRequest, validateAddPostReq, (req, res, next) => {
  postController.add(req, res, next);
}); // Route to add new post

postRouter.put(
  '/:id',
  verifyPostOwnership,
  uploadPostMedia,
  logRequest,
  validateUpdatePostReq,
  (req, res, next) => {
    postController.update(req, res, next);
  }
); // Route to update a specific user post

postRouter.delete('/:id', (req, res, next) => {
  postController.delete(req, res, next);
}); // Route to delete a specific post

export default postRouter;
