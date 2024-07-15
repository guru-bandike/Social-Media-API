import mongoose from 'mongoose';
import CustomError from '../errors/CustomError.js';

/**
 * Validates the provided MongoDB ObjectId.
 * @param {string} id - The ObjectId to be validated.
 * @param {string} idType - The type of ID (e.g., 'userId', 'postId', 'targetId', 'approverId').
 * @throws {CustomError} If the ObjectId is invalid.
 */
const validateMongodbObjectId = async (id, idType) => {
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id) || String(id).length !== 24) {
      throw new CustomError(`Invalid ${idType}!`, 400, { [idType]: id });
    }
  } catch (err) {
    throw err;
  }
};

export default validateMongodbObjectId;
