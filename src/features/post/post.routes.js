import express from 'express';
import PostController from './post.controller.js';
import logRequest from '../../middlewares/logRequest.middleware.js';
import uploadPostMedia from '../../middlewares/uploadPostMedia.middleware.js';
import validateAddPostReq from '../../middlewares/validateAddPostReq.validation.middleware.js';
import validateUpdatePostReq from '../../middlewares/validateUpdatePostReq.validation.middleware.js';
import deleteLikesAndComments from '../../middlewares/deleteLikesAndComments.middleware.js';

// Create express router instance for handling post related routes
const postRouter = express.Router();
// Create Post controller instance for handling post related operations
const postController = new PostController();

// Define post routes
postRouter.get('/', postController.getByUserId); // Route to get all user posts
postRouter.get('/all', postController.getAll); // Route to get all existing posts
postRouter.get('/filter', postController.filter); // Route to filter and get posts
postRouter.get('/:id', postController.get); // Route to get a specific post
postRouter.post('/', uploadPostMedia, logRequest, validateAddPostReq, postController.add); // Route to add new post
postRouter.put('/:id', uploadPostMedia, logRequest, validateUpdatePostReq, postController.update); // Route to update a specific user post
postRouter.delete('/:id', postController.delete, deleteLikesAndComments); // Route to delete a specific post

export default postRouter;
