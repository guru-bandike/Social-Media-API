import CustomError from '../../errors/CustomError.js';
import validateMongodbObjectId from '../../utils/validateMongodbObjectId.js';
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
      // validate post id
      await validateMongodbObjectId(postId, 'post');

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
    const { userId, mediaUrl } = req;
    const { caption } = req.body;

    try {
      // Add new post
      const addedPost = await this.PostRepo.add(userId, caption, mediaUrl);

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
    const postId = req.params.id;
    const { caption } = req.body;
    const mediaUrl = req.mediaUrl;

    try {
      // Validate post id
      await validateMongodbObjectId(postId, 'post');

      // Update new post using product model
      const updatedPost = await this.PostRepo.update(postId, caption, mediaUrl);

      // Send success response with updated post
      res.status(200).json({
        success: true,
        message: 'Post has been successfully updated!',
        updatedPost,
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
      // Validate post id
      await validateMongodbObjectId(postId, 'post');

      // Delete specified post using product model
      const deletedPost = await this.PostRepo.delete(userId, postId);

      // Send success response with deleted post
      res
        .status(200)
        .json({ success: true, message: 'Post has been successfully deleted!', deletedPost });
    } catch (err) {
      next(err);
    }
  }

  // Method to filter posts
  async filter(req, res, next) {
    const searchQuery = req.query.searchQuery;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      // If the searchQuery is not provided, throw Custom error to sent failure message
      if (!searchQuery || searchQuery.trim().length === 0)
        throw new CustomError('Search Query is required!', 400, { searchQuery });

      // If page or limit is less than 1, throw Custom error to sent failure message
      if (page < 1 || limit < 1)
        throw new CustomError('page and limit must be positive numbers!', 400, {
          requestData: { page: req.query.page, limit: req.query.limit },
        });

      // Filter and get posts using product model
      const filteredPosts = await this.PostRepo.filter(searchQuery, page, limit);

      // Send success response with filtered posts
      res.status(200).json({
        success: true,
        message: 'Post has been successfully filtered!',
        searchQuery,
        filteredPosts,
      });
    } catch (err) {
      next(err);
    }
  }
}
