import { CommentModel } from '../features/comment/comment.model.js';
import { PostModel } from '../features/post/post.model.js';
import { UserModel } from '../features/user/user.model.js';

// Valid operations that can be performed on fields
const validOperations = ['push', 'pull'];

// Valid fields that can be updated in documents
const validFields = ['posts', 'likes', 'comments'];

/**
 * Updates a user document based on the specified field, operation, and value.
 * @throws Will throw an error if the field or operation is invalid, or if the user document update fails.
 */
export const updateUserDoc = async (userId, field, operation, value, session) => {
  validateFieldAndOperation(field, operation);

  const update = getUpdate(field, operation, value);
  const updatedUser = await UserModel.findByIdAndUpdate(userId, update, {
    session,
    runValidators: true,
    new: true,
  });

  if (!updatedUser) {
    throw new Error('User updation failed!');
  }
};

/**
 * Updates a post document based on the specified field, operation, and value.
 * @throws Will throw an error if the field or operation is invalid, or if the post document update fails.
 */
export const updatePostDoc = async (postId, field, operation, value, session) => {
  validateFieldAndOperation(field, operation);

  const update = getUpdate(field, operation, value);
  const updatedPost = await PostModel.findByIdAndUpdate(postId, update, {
    session,
    runValidators: true,
    new: true,
  });

  if (!updatedPost) {
    throw new Error('Post updation failed!');
  }
};

/**
 * Updates a comment document based on the specified field, operation, and value.
 * @throws Will throw an error if the field or operation is invalid, or if the comment document update fails.
 */
export const updateCommentDoc = async (commentId, field, operation, value, session) => {
  validateFieldAndOperation(field, operation);

  const update = getUpdate(field, operation, value);
  const updatedComment = await CommentModel.findByIdAndUpdate(commentId, update, {
    session,
    runValidators: true,
    new: true,
  });

  if (!updatedComment) {
    throw new Error('Comment updation failed!');
  }
};

// -------------------------------- Helper's helper section: Start -------------------------------- //

/**
 * Validates the field and operation before performing an update.
 * @throws Will throw an error if the field or operation is invalid.
 */
const validateFieldAndOperation = (field, operation) => {
  if (!validFields.includes(field)) {
    throw new Error('Invalid field!');
  }
  if (!validOperations.includes(operation)) {
    throw new Error('Invalid operation!');
  }
};

/**
 * Constructs the update object based on the field, operation, and value.
 * @returns {Object} The update object for Mongoose update operations.
 */
const getUpdate = (field, operation, value) => {
  return operation === 'push' ? { $push: { [field]: value } } : { $pull: { [field]: value } };
};

// -------------------------------- Helper's helper section: End -------------------------------- //
