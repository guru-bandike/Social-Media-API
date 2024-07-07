import UserRepository from '../user/user.repository.js';
import { PostModel } from './post.model.js';
import CustomError from '../../errors/CustomError.js';

export default class PostRepository {
  constructor() {
    this.UserRepo = new UserRepository();
  }

  // Method to get all posts
  async getAll(page, limit) {
    try {
      const skip = (page - 1) * limit;

      // Find target posts with total posts count
      const posts = (
        await PostModel.aggregate([
          {
            $facet: {
              paginatedPosts: [{ $skip: skip }, { $limit: limit }],
              totalPosts: [{ $count: 'count' }],
            },
          },
        ])
      )[0];

      if (posts.totalPosts.length === 0)
        return {
          totalPosts: 0,
          totalPages: 0,
          currentPage: page,
          paginatedPosts: [],
        };

      const totalPosts = posts.totalPosts[0].count;
      const totalPages = Math.ceil(totalPosts / limit);

      // If the requested page is greater than total pages, throw custom error to send failure response
      if (page > totalPages)
        throw new CustomError('Invalid page number!', 400, {
          requestedPage: page,
          totalPages,
        });

      return {
        totalPosts,
        totalPages: totalPages,
        currentPage: page,
        paginatedPosts: posts.paginatedPosts,
      };
    } catch (err) {
      throw err;
    }
  }

  // Method to get specific post
  async getById(postId) {
    try {
      return await PostModel.findById(postId);
    } catch (err) {
      throw err;
    }
  }

  // Method to get all user posts
  async getByUserId(userId, page, limit) {
    try {
      const userDoc = await this.UserRepo.getById(userId);
      const totalPosts = userDoc?.posts?.length || 0;
      const totalPages = Math.ceil(totalPosts / limit);

      // If user don't have any post, return empty posts array
      if (totalPosts == 0)
        return {
          totalPosts,
          totalPages,
          paginatedPosts: [],
        };

      // If the requested page is greater than total pages, throw custom error to send failure response
      if (page > totalPages)
        throw new CustomError('Invalid page number!', 400, {
          requestedPage: page,
          totalPages,
        });

      // Populate target posts only
      const paginatedPosts = (
        await userDoc.populate({
          path: 'posts',
          options: { skip: (page - 1) * limit, limit },
        })
      ).posts;

      // Return paginated posts
      return {
        totalPosts,
        totalPages,
        currentPage: page,
        paginatedPosts,
      };
    } catch (err) {
      throw err;
    }
  }

  // Method to add new Post
  async add(userId, caption, mediaUrl) {
    try {
      const newPost = await new PostModel({ userId, mediaUrl, caption }).save();
      return newPost;
    } catch (err) {
      throw err;
    }
  }

  // Method to update specific post
  async update(postId, caption, mediaUrl) {
    try {
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $set: { caption, mediaUrl },
        },
        { new: true }
      );
      return updatedPost;
    } catch (err) {
      throw err;
    }
  }

  // Method to delete specific post
  async delete(userId, postId) {
    try {
      return await PostModel.findOneAndDelete({ _id: postId, userId });
    } catch (err) {
      throw err;
    }
  }

  // Method to filter using captions
  async filter(searchQuery, page, limit) {
    try {
      const regexSearchQuery = new RegExp(searchQuery, 'i'); // 'i' makes regex case-insensitive
      const filteredPosts = (
        await PostModel.aggregate([
          {
            $match: { caption: regexSearchQuery },
          },
          {
            $facet: {
              posts: [{ $skip: (page - 1) * limit }, { $limit: limit }],
              totalCount: [{ $count: 'count' }],
            },
          },
        ])
      )[0];

      if (filteredPosts.totalCount.length === 0)
        return {
          totalPosts: 0,
          totalPages: 0,
          currentPage: page,
          paginatedPosts: [],
        };

      const totalPosts = filteredPosts.totalCount[0].count;
      const totalPages = Math.ceil(totalPosts / limit);

      // If the requested page is greater than total pages, throw custom error to send failure response
      if (page > totalPages)
        throw new CustomError('Invalid page number!', 400, {
          requestedPage: page,
          totalPages,
        });

      return {
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
        paginatedPosts: filteredPosts.posts,
      };
    } catch (err) {
      throw err;
    }
  }

  // Method to check post existance
  async isExists(postId) {
    try {
      const post = await PostModel.findById(postId);
      return Boolean(post);
    } catch (err) {
      throw err;
    }
  }
}
