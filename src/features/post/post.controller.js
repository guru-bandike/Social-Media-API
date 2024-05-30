import CustomError from '../../errors/CustomError.js';
import PostModel from './post.model.js';

export default class PostController {
  // Method to get all existing posts
  getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // If page or limit is less than 1, throw Custom error to sent failure message
    if (page < 1 || limit < 1)
      throw new CustomError('page and limit must be positive numbers!', 400, {
        requestData: { page: req.query.page, limit: req.query.limit },
      });

    // Find existing post and paginate
    const paginatedPosts = PostModel.getAll(page, limit);

    // Send success response with paginated posts
    res.status(200).json({
      success: true,
      message: 'Posts has been successfully found!',
      paginatedPosts,
    });
  }

  // Method to get a specific post
  get(req, res) {
    const postId = req.params.id;

    // Find requested post using post model
    const foundPost = PostModel.get(postId);

    // Send success response with requested post
    res
      .status(200)
      .json({ success: true, message: 'Requested post has been successfully found!', foundPost });
  }

  // Method to get all of user posts
  getByUserId(req, res) {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // If page or limit is less than 1, throw Custom error to sent failure message
    if (page < 1 || limit < 1)
      throw new CustomError('page and limit must be positive numbers!', 400, {
        requestData: { page: req.query.page, limit: req.query.limit },
      });

    // Find all of user posts using post model
    const paginatedPosts = PostModel.getByUserId(userId, page, limit);

    // Send success response with all user posts
    res.status(200).json({
      success: true,
      message: 'User posts has been successfully found!',
      paginatedPosts,
    });
  }

  // Method to add new post
  add(req, res) {
    const userId = req.userId;
    const { caption } = req.body;
    const mediaUrl = req.file.filename;

    // Add new post using product model
    const addedPost = PostModel.add(userId, caption, mediaUrl);

    // Send success response with newly added post
    res
      .status(201)
      .json({ success: true, message: 'Post has been successfully added!', addedPost });
  }

  // Method to update existing post
  async update(req, res, next) {
    const userId = req.userId;
    const postId = req.params.id;
    const { caption } = req.body;
    const mediaUrl = req.file?.filename ?? undefined;

    try {
      // Update new post using product model
      const updatedPost = await PostModel.update(userId, postId, caption, mediaUrl);
      res
        .status(200)
        .json({ success: true, message: 'Post has been successfully updated!', updatedPost });
    } catch (error) {
      return next(error);
      // Send success response with newly added post
    }
  }

  // Method to delete a specific post of user
  delete(req, res, next) {
    const userId = req.userId;
    const postId = req.params.id;

    // Delete specified post using product model
    const deletedPost = PostModel.delete(userId, postId);

    // Send success response with deleted post
    res
      .status(200)
      .json({ success: true, message: 'Post has been successfully deleted!', deletedPost });

    // Call next middleware to delete like and comments of deleted post
    next();
  }

  // Method to filter post using captions
  filter(req, res) {
    const caption = req.query.caption;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // If page or limit is less than 1, throw Custom error to sent failure message
    if (page < 1 || limit < 1)
      throw new CustomError('page and limit must be positive numbers!', 400, {
        requestData: { page: req.query.page, limit: req.query.limit },
      });

    // Filter and get posts using product model
    const paginatedPosts = PostModel.filter(caption, page, limit);

    // Send success response with filtered posts
    res.status(200).json({
      success: true,
      message: 'Post has been successfully filtered',
      query: caption,
      paginatedPosts,
    });
  }
}
