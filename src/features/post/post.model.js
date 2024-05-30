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
  static getAll(page, limit) {
    // Paginate posts
    const paginatedPosts = paginate(posts, page, limit);

    // If there are no post, throw an custom error to send failure response
    if (paginatedPosts.posts.length == 0) {
      throw new CustomError('There are no posts to get!', 404);
    }

    return paginatedPosts;
  }

  // Method to get a specific post by post id
  static get(postId) {
    const targetPost = posts.find((p) => p.id == postId);

    if (!targetPost) {
      throw new CustomError('The requested post was not found!', 404, {
        requestedPostId: postId,
      });
    }

    return targetPost;
  }

  // Method to get all user posts
  static getByUserId(userId, page, limit) {
    const userPosts = posts.filter((p) => p.userId == userId);

    // Paginate user posts
    const paginatedPosts = paginate(userPosts, page, limit);

    // If there are no post, throw an custom error to send failure response
    if (paginatedPosts.posts.length == 0) {
      throw new CustomError('There are no posts of the user!', 404);
    }

    return paginatedPosts;
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

  // Method to filter post using captions
  static filter(caption, page, limit) {
    const filteredPosts = posts.filter((p) => p.caption.includes(caption));

    // Paginate user posts
    const paginatedPosts = paginate(filteredPosts, page, limit);

    // If there are no post, throw an custom error to send failure response
    if (paginatedPosts.posts.length == 0) {
      throw new CustomError('There are no posts with the query!', 404);
    }

    return filteredPosts;
  }

  // Method to check a specific post existence
  static isExists(postId) {
    return posts.some((p) => p.id == postId);
  }
}

// Private helper method to paginate posts
function paginate(posts, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedPosts = posts.slice(startIndex, endIndex);

  return {
    currentPage: page,
    totalPosts: posts.length,
    totalPages: Math.ceil(posts.length / limit),
    posts: paginatedPosts,
  };
}

// Existing posts
let posts = [
  new PostModel(1, 'Living my life in my style 🌟✨', 'test-image.png'),
  new PostModel(2, 'Just another Magic Monday 🎩✨', 'test-image.png'),
  new PostModel(3, 'Sassy, classy, and a bit smart-assy 💁♀️', 'test-image.png'),
  new PostModel(4, 'Keep your heels, head, and standards high 👠👑', 'test-image.png'),
  new PostModel(5, 'Wanderlust and city dust 🏙️✈️', 'test-image.png'),
  new PostModel(6, 'Seas the day, ocean waves at play 🌊⛵', 'test-image.png'),
  new PostModel(7, 'Coffee in one hand, confidence in the other ☕💪', 'test-image.png'),
  new PostModel(8, 'A little bit of sunshine mixed with a hurricane 🌤️💨', 'test-image.png'),
  new PostModel(9, 'Reality called, so I hung up 📵🚫', 'test-image.png'),
  new PostModel(10, 'Serving looks, not tea 🍽️🚫', 'test-image.png'),
  new PostModel(1, 'Dressed to impress 👗💄', 'test-image.png'),
  new PostModel(2, 'Life is short, make it sweet 🍭❤️', 'test-image.png'),
  new PostModel(3, 'Adventure awaits 🌍🚀', 'test-image.png'),
  new PostModel(4, 'Chasing dreams, not people 🌈🏃', 'test-image.png'),
  new PostModel(5, 'Stay wild, stay free 🦋✨', 'test-image.png'),
  new PostModel(6, 'Make every day count ⏳✔️', 'test-image.png'),
  new PostModel(7, 'Good vibes only 🌞💛', 'test-image.png'),
  new PostModel(8, 'Find the beauty in everything 🌸🌺', 'test-image.png'),
  new PostModel(9, 'Create your own sunshine 🌞✨', 'test-image.png'),
  new PostModel(10, 'Believe in yourself 🌟💪', 'test-image.png'),
  new PostModel(1, 'Live more, worry less 🌈😊', 'test-image.png'),
  new PostModel(2, 'Dream big, work hard 💭💪', 'test-image.png'),
  new PostModel(3, 'Be your own kind of beautiful 🌹💫', 'test-image.png'),
  new PostModel(4, 'Find joy in the journey 🛤️🌻', 'test-image.png'),
  new PostModel(5, 'Embrace the glorious mess that you are 🌪️💫', 'test-image.png'),
  new PostModel(6, 'You are enough, just as you are 🌟❤️', 'test-image.png'),
  new PostModel(7, 'Risking is better than regretting 🎲❎', 'test-image.png'),
  new PostModel(8, 'Focus on the good 🌟🌈', 'test-image.png'),
  new PostModel(9, 'Choose happiness 🌟✨', 'test-image.png'),
  new PostModel(10, 'Stay positive, work hard, make it happen 💪✨', 'test-image.png'),
];
