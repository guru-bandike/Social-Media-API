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
  static getAll(page, limit) {
    // Paginate comments
    const paginatedComments = paginate(comments, page, limit);

    // If there are no post, throw an custom error to send failure response
    if (paginatedComments.comments.length == 0) {
      throw new CustomError('There are no comments of the user!', 404);
    }

    return paginatedComments;
  }

  // Method to get all existing comments of a specific post
  static getPostComments(postId, page, limit) {
    const postComments = comments.filter((c) => c.postId == postId);

    // Paginate comments
    const paginatedComments = paginate(postComments, page, limit);

    // If there are no post, throw an custom error to send failure response
    if (paginatedComments.comments.length == 0) {
      throw new CustomError('There are no comments of the user!', 404);
    }
    return paginatedComments;
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

// Private helper method to paginate comments
function paginate(comments, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedComments = comments.slice(startIndex, endIndex);

  return {
    currentPage: page,
    totalcomments: comments.length,
    totalPages: Math.ceil(comments.length / limit),
    comments: paginatedComments,
  };
}

// Existing comments
let comments = [
  new CommentModel(1, 6, 'Love the ocean waves!'),
  new CommentModel(3, 2, 'Magic Monday indeed!'),
  new CommentModel(2, 1, 'Living the best life!'),
  new CommentModel(4, 3, 'Sassy and classy!'),
  new CommentModel(5, 4, 'High standards, I love it!'),
  new CommentModel(6, 5, 'Wanderlust vibes!'),
  new CommentModel(7, 7, 'Coffee and confidence!'),
  new CommentModel(8, 8, 'Sunshine and hurricane mix!'),
  new CommentModel(9, 9, 'Hanging up on reality!'),
  new CommentModel(1, 2, 'Magic Mondays are the best!'),
  new CommentModel(2, 3, 'Sassy and smart-assy!'),
  new CommentModel(3, 4, 'High heels and high standards!'),
  new CommentModel(4, 5, 'City dust and wanderlust!'),
  new CommentModel(5, 6, 'Seas the day!'),
  new CommentModel(6, 7, 'Confidence is key!'),
  new CommentModel(7, 8, 'A mix of sunshine and hurricane!'),
  new CommentModel(8, 9, 'Hanging up on reality!'),
  new CommentModel(1, 3, 'Smart-assy indeed!'),
  new CommentModel(2, 4, 'High standards all the way!'),
  new CommentModel(3, 5, 'Love the wanderlust!'),
  new CommentModel(4, 6, 'Seas the day!'),
  new CommentModel(5, 7, 'Coffee and confidence for the win!'),
  new CommentModel(6, 8, 'Sunshine and hurricane, what a mix!'),
  new CommentModel(7, 9, 'Reality can wait!'),
  new CommentModel(9, 1, 'Living life in style!'),
  new CommentModel(10, 1, 'Absolutely living your best life!'),
  new CommentModel(10, 2, 'Mondays made magical!'),
  new CommentModel(9, 10, 'Serving looks indeed!'),
  new CommentModel(8, 10, 'Not serving tea, just looks!'),
  new CommentModel(10, 10, 'Keep serving those looks!'),
];
