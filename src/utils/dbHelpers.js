import { PostModel } from '../features/post/post.model.js';
import { UserModel } from '../features/user/user.model.js';
import { CommentModel } from '../features/comment/comment.model.js';

// Valid operations that can be performed on fields
const validOperations = ['push', 'pull'];

// Valid fields that can be updated in documents
const validFields = ['posts', 'likes', 'comments'];

// Mapping model types to their respective Mongoose models(collections)
const modelMap = {
  user: UserModel,
  post: PostModel,
  comment: CommentModel,
};

/**
 * Updates a document based on the specified model type(collection), field, operation, and value.
 * @throws Will throw an error if the field, operation, or model type(collection) is invalid, or if the document update fails.
 */
export const updateDocument = async (modelType, docId, field, operation, value, session) => {
  validateInputs(modelType, field, operation);

  const model = modelMap[modelType];
  const update = getUpdate(field, operation, value);
  const updatedDoc = await model.findByIdAndUpdate(docId, update, {
    session,
    runValidators: true,
    new: true,
  });

  if (!updatedDoc) {
    throw new Error(`${modelType} update failed!`);
  }
};

// -------------------------------- Helper's helper section: Start -------------------------------- //

/**
 * Validates the model type(collection), field, and operation before performing an update.
 * @throws Will throw an error if the model type(collection), field, or operation is invalid.
 */
const validateInputs = (modelType, field, operation) => {
  if (!modelMap[modelType]) {
    throw new Error('Invalid model type!');
  }
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
