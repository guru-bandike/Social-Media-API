import CustomError from '../../errors/CustomError.js';

export default class CommentModel {
  // Initialize id counter to keep track of comment ids
  static idCounter = 0;

  // Constructor to create comments
  constructor(userId, postId, comment) {
    this.id = ++CommentModel.idCounter;
    this.userId = userId;
    this.postId = postId;
    this.comment = comment;
  }

  // Method get all existing comments
  static getAll() {
    return comments;
  }

  // Method to get all existing comments of a specific post
  static getPostComments(postId) {
    const AllExistingcomments = comments.filter((c) => c.postId == postId);
    return AllExistingcomments;
  }

  // Method to add new comment on a specific post
  static add(userId, postId, comment) {
    const addedcomment = new CommentModel(userId, postId, comment);
    comments.push(addedcomment);
    return addedcomment;
  }

  // Method to update a specific existing comment of user
  static update(userId, commentId, comment) {
    // Find existig comment index of user
    const targetIndex = comments.findIndex((c) => c.userId == userId && c.id == commentId);

    // If target index not found, throw custom error to send failure response
    if (targetIndex == -1)
      throw new CustomError('Comment not found in user comments!', 404, {
        requestData: { commentId, comment },
      });

    // Update comment
    const updatedComment = (comments[targetIndex].comment = comment);
    return updatedComment;
  }

  // Method to delete a specific existing comment of user
  static delete(userId, commentId) {
    // Find existig comment index of user
    const targetIndex = comments.findIndex((c) => c.userId == userId && c.id == commentId);

    // If target index not found, throw custom error to send failure response
    if (targetIndex == -1)
      throw new CustomError('Comment not found in user comments!', 404, {
        requestCommentId: commentId,
      });

    // Delete target comment and get
    const deletedComment = comments.splice(targetIndex, 1);

    return deletedComment;
  }

  // Method to delete all comments of a specific post
  // Using the In-place removal technique
  static deleteByPostId(postId) {
    // Initialize writeIndex to keep track of where to put non-target comments
    let writeIndex = 0;

    // Iterate through each comment in the 'comments' array
    for (let readIndex in comments) {
      // If the current comment is not for the target post, copy it to the writeIndex position
      if (comments[readIndex].postId != postId) {
        comments[writeIndex] = comments[readIndex]; // Copy the comment
        writeIndex++; // Move the writeIndex to the next position
      }
    }

    // Truncate the 'comments' array to remove extra elements beyond writeIndex
    comments.length = writeIndex;
  }
}

// Existing comments
let comments = [
  new CommentModel(1, 6, 'user 1 comment on post 6'),
  new CommentModel(3, 2, 'user 3 comment on post 2'),
  new CommentModel(2, 1, 'user 2 comment on post 1'),
  new CommentModel(4, 3, 'user 4 comment on post 3'),
  new CommentModel(5, 4, 'user 5 comment on post 4'),
  new CommentModel(6, 5, 'user 6 comment on post 5'),
  new CommentModel(7, 7, 'user 7 comment on post 7'),
  new CommentModel(8, 8, 'user 8 comment on post 8'),
  new CommentModel(9, 9, 'user 9 comment on post 9'),
  new CommentModel(1, 2, 'user 1 comment on post 2'),
  new CommentModel(2, 3, 'user 2 comment on post 3'),
  new CommentModel(3, 4, 'user 3 comment on post 4'),
  new CommentModel(4, 5, 'user 4 comment on post 5'),
  new CommentModel(5, 6, 'user 5 comment on post 6'),
  new CommentModel(6, 7, 'user 6 comment on post 7'),
  new CommentModel(7, 8, 'user 7 comment on post 8'),
  new CommentModel(8, 9, 'user 8 comment on post 9'),
  new CommentModel(1, 3, 'user 1 comment on post 3'),
  new CommentModel(2, 4, 'user 2 comment on post 4'),
  new CommentModel(3, 5, 'user 3 comment on post 5'),
  new CommentModel(4, 6, 'user 4 comment on post 6'),
  new CommentModel(5, 7, 'user 5 comment on post 7'),
  new CommentModel(6, 8, 'user 6 comment on post 8'),
  new CommentModel(7, 9, 'user 7 comment on post 9'),
  new CommentModel(9, 1, 'user 9 comment on post 1'),
  new CommentModel(10, 1, 'user 10 comment on post 1'),
  new CommentModel(10, 2, 'user 10 comment on post 2'),
  new CommentModel(9, 10, 'user 9 comment on post 10'),
  new CommentModel(8, 10, 'user 8 comment on post 10'),
  new CommentModel(10, 10, 'user 10 comment on post 10'),
];
