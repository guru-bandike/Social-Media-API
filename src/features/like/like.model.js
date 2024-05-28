export default class LikeModel {
  // Initialize id counter to keep track of like ids
  static idCounter = 0;

  // Constructor to create likes
  constructor(userId, postId) {
    this.id = ++LikeModel.idCounter;
    this.userId = userId;
    this.postId = postId;
  }

  // Method get all existing Likes
  static getAll() {
    return likes;
  }

  // Method to toggle like
  static toggle(userId, postId) {
    // Find existing like index of a particuler user and post
    const existingLikeIndex = likes.findIndex((l) => l.userId == userId && l.postId == postId);

    // If like not found, add new one
    if (existingLikeIndex == -1) {
      const newLike = new LikeModel(userId, postId);
      likes.push(newLike);
    } else {
      // If like found, remove
      likes.splice(existingLikeIndex, 1);
    }
  }

  // Method to get all likes of a particular post
  static getByPostId(postId) {
    const postLikes = likes.filter((l) => l.postId == postId);
    return postLikes;
  }

  // Method to delete all likes of a specific post
  // Using the In-place removal technique
  static deleteByPostId(postId) {
    // Initialize writeIndex to keep track of where to put non-target likes
    let writeIndex = 0;

    // Iterate through each like in the 'likes' array
    for (let readIndex in likes) {
      // If the current like is not for the target post, copy it to the writeIndex position
      if (likes[readIndex].postId != postId) {
        likes[writeIndex] = likes[readIndex]; // Copy the like
        writeIndex++; // Move the writeIndex to the next position
      }
    }

    // Truncate the 'likes' array to remove extra elements beyond writeIndex
    likes.length = writeIndex;
  }
}

let likes = [
  new LikeModel(1, 10),
  new LikeModel(2, 3),
  new LikeModel(3, 5),
  new LikeModel(4, 7),
  new LikeModel(5, 9),
  new LikeModel(6, 2),
  new LikeModel(7, 4),
  new LikeModel(8, 6),
  new LikeModel(9, 8),
  new LikeModel(10, 3),
  new LikeModel(2, 4),
  new LikeModel(3, 6),
  new LikeModel(4, 8),
  new LikeModel(5, 10),
  new LikeModel(6, 3),
  new LikeModel(7, 5),
  new LikeModel(8, 7),
  new LikeModel(9, 2),
  new LikeModel(1, 4),
  new LikeModel(2, 5),
  new LikeModel(3, 7),
  new LikeModel(4, 9),
  new LikeModel(5, 2),
  new LikeModel(6, 4),
  new LikeModel(7, 6),
  new LikeModel(8, 9),
  new LikeModel(9, 1),
  new LikeModel(10, 6),
  new LikeModel(2, 7),
  new LikeModel(3, 8),
];
