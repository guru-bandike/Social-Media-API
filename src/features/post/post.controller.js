import CustomError from '../../errors/CustomError.js';
import deleteUploadedFile from '../../utils/deleteUploadFile.js';
import UserRepository from '../user/user.repository.js';
import PostRepository from './post.repository.js';

export default class PostController {
  constructor() {
    this.PostRepo = new PostRepository();
    this.UserRepo = new UserRepository();
  }

  // Method to get all existing posts
  async getAll(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      // If page or limit is less than 1, throw Custom error to sent failure message
      if (page < 1 || limit < 1)
        throw new CustomError('page and limit must be positive numbers!', 400, {
          requestData: { page: req.query.page, limit: req.query.limit },
        });

      // Find all existing paginated post
      const allPosts = await this.PostRepo.getAll(page, limit);

      // Send success response with paginated posts
      res.status(200).json({
        success: true,
        message: 'Posts has been successfully found!',
        allPosts,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to get a specific post
  async getById(req, res, next) {
    const postId = req.params.id;

    try {
      // Find requested post
      const foundPost = await this.PostRepo.getById(postId);

      if (!foundPost)
        return next(new CustomError('Post not found with provided Post Id!', 404, { postId }));

      // Send success response with requested post
      res
        .status(200)
        .json({ success: true, message: 'Requested post has been successfully found!', foundPost });
    } catch (err) {
      next(err);
    }
  }

  // Method to get all of user posts
  async getByUserId(req, res, next) {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      // If page or limit is less than 1, throw Custom error to sent failure message
      if (page < 1 || limit < 1)
        throw new CustomError('page and limit must be positive numbers!', 400, {
          requestData: { page: req.query.page, limit: req.query.limit },
        });

      // Find all of user paginated posts
      const userPosts = await this.PostRepo.getByUserId(userId, page, limit);

      // Send success response with all user posts
      res.status(200).json({
        success: true,
        message: 'User posts has been successfully found!',
        userPosts,
      });
    } catch (err) {
      next(err);
    }
  }

  // Method to add new post
  async add(req, res, next) {
    const userId = req.userId;
    const { caption } = req.body;
    const port = process.env.PORT || 5000;
    const mediaUrl = `http://localhost:${port}/uploads/` + req.file.filename;

    try {
      // Add new post
      const addedPost = await this.PostRepo.add(userId, caption, mediaUrl);
      // Add new Post ID to the uesr
      await this.UserRepo.addPostToUser(userId, addedPost._id);

      // Send success response with newly added post
      res
        .status(201)
        .json({ success: true, message: 'Post has been successfully added!', addedPost });
    } catch (err) {
      next(err);
    }
  }

  // Method to update existing post
  async update(req, res, next) {
    const userId = req.userId;
    const postId = req.params.id;
    const { caption } = req.body;
    const port = process.env.PORT || 5000;
    const mediaUrl = req.file ? `http://localhost:${port}/uploads/` + req.file.filename : undefined;

    try {
      // Update new post using product model
      const response = await this.PostRepo.update(postId, caption, mediaUrl);

      // If Media is updated, delete old media
      if (response.oldMediaUrl) {
        const oldMediaName = response.oldMediaUrl.split('/').pop();
        await deleteUploadedFile(oldMediaName);
      }

      // Send success response with updated post
      res.status(200).json({
        success: true,
        message: 'Post has been successfully updated!',
        updatedPost: response.post,
      });
    } catch (error) {
      return next(error);
    }
  }

  // Method to delete a specific post of user
  async delete(req, res, next) {
    const userId = req.userId;
    const postId = req.params.id;

    try {
      // Delete specified post using product model
      const deletedPost = await this.PostRepo.delete(userId, postId);

      // If post not deleted then it mean post not found, send failure response
      if (!deletedPost)
        return next(new CustomError('Post not found in user posts!', 404, { postId }));

      // Delete post from user
      await this.UserRepo.deletePostFromUser(userId, postId);

      // Delete post media
      await deleteUploadedFile(deletedPost.mediaUrl);

      // Send success response with deleted post
      res
        .status(200)
        .json({ success: true, message: 'Post has been successfully deleted!', deletedPost });
    } catch (err) {
      next(err);
    }
  }

  // Method to filter posts using captions
  async filter(req, res, next) {
    const caption = req.query.caption;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      // If the caption is not provided, throw Custom error to sent failure message
      if (!caption || caption.trim().length === 0)
        throw new CustomError('Caption is required!', 400, { caption });

      // If page or limit is less than 1, throw Custom error to sent failure message
      if (page < 1 || limit < 1)
        throw new CustomError('page and limit must be positive numbers!', 400, {
          requestData: { page: req.query.page, limit: req.query.limit },
        });

      // Filter and get posts using product model
      const filteredPosts = await this.PostRepo.filter(caption, page, limit);

      // Send success response with filtered posts
      res.status(200).json({
        success: true,
        message: 'Post has been successfully filtered!',
        query: caption,
        filteredPosts,
      });
    } catch (err) {
      next(err);
    }
  }
}
