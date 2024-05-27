import CustomError from '../../errors/CustomError.js';
import fs from 'fs/promises';
import path from 'path';

export default class PostModel {
  // Initialize id counter to keep track of post ids
  static idCounter = 0;

  // Constructor to create posts
  constructor(userId, caption, mediaUrl) {
    this.id = ++PostModel.idCounter;
    this.userId = userId;
    this.caption = caption;
    this.mediaUrl = mediaUrl;
  }

  // Method to get all posts
  static getAll() {
    // If there are no post, throw an custom error to send failure response
    if (posts.length == 0) {
      throw new CustomError('There are no posts to get!', 404);
    }

    // Otherwise, return all posts
    return posts;
  }

  // Method to get a specific post by post id
  static get(userId, postId) {
    const targetPost = posts.find((p) => p.userId == userId && p.id == postId);

    if (!targetPost) {
      throw new CustomError("The requested post was not found among the user's posts!", 404, {
        requestedPostId: postId,
      });
    }

    return targetPost;
  }

  static getByUserId(userId) {
    // Method to get all user posts
    const userPosts = posts.filter((p) => p.userId == userId);

    // If there are no post, throw an custom error to send failure response
    if (userPosts.length == 0) {
      throw new CustomError('There are no posts of the user!', 404);
    }

    // Otherwise, return all user posts
    return userPosts;
  }

  // Method to Add new post
  static add(userId, caption, mediaUrl) {
    const newPost = new PostModel(userId, caption, mediaUrl);
    posts.push(newPost);
    return newPost;
  }

  // Method to Update post
  static async update(userId, postId, caption, mediaUrl) {
    // Find user post
    const userPostIndex = posts.findIndex((p) => p.userId == userId && p.id == postId);

    // If user post not found
    if (userPostIndex == -1) {
      // If user has uploaded media, then only delete the uploaded post media
      if (mediaUrl) await fs.unlink(path.join(path.resolve(), '/uploads/', mediaUrl));
      // throw custom error to send failure response
      throw new CustomError('Post not found in user posts!', 404);
    }

    // If user sent caption to update, then only update
    if (caption) posts[userPostIndex].caption = caption;

    // If user sent post media to update, then only update
    if (mediaUrl) posts[userPostIndex].mediaUrl = mediaUrl;

    // Extract updated post
    const updatedPost = posts[userPostIndex];

    return updatedPost; // Return updated post
  }

  // Method to Delete post
  static delete(userId, postId) {
    // Find user post
    const userPostIndex = posts.findIndex((p) => p.userId == userId && p.id == postId);

    // If user post not found, throw custom error to send failure response
    if (userPostIndex == -1) throw new CustomError('Post not found in user posts!', 404);

    // Delete post and get
    const deletedPost = posts.splice(userPostIndex, 1);

    return deletedPost; // Return deleted post
  }

  // Method to check a specific post existence
  static isExists(postId) {
    return posts.some((p) => p.id == postId);
  }
}

// Existing posts
let posts = [
  new PostModel(1, '1st post caption', 'test-image.png'),
  new PostModel(2, '2nd post caption', 'test-image.png'),
  new PostModel(3, '3rd post caption', 'test-image.png'),
  new PostModel(4, '4th post caption', 'test-image.png'),
  new PostModel(5, '5th post caption', 'test-image.png'),
  new PostModel(6, '6th post caption', 'test-image.png'),
  new PostModel(7, '7th post caption', 'test-image.png'),
  new PostModel(8, '8th post caption', 'test-image.png'),
  new PostModel(9, '9th post caption', 'test-image.png'),
  new PostModel(10, '10th post caption', 'test-image.png'),
];
