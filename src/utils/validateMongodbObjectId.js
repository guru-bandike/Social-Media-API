import mongoose from 'mongoose';
import CustomError from '../errors/CustomError.js';

/**
 * Validates the provided MongoDB ObjectId.
 * @param {string} id - The ObjectId to be validated.
 * @param {string} collectionName - The name of the collection to which the ID belongs.
 * @throws {CustomError} If the ObjectId is invalid.
 */
const validateMongodbObjectId = async (id, collectionName) => {
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id) || String(id).length !== 24) {
      throw new CustomError(`Invalid ${collectionName} Id!`, 400, { [`${collectionName}Id`]: id });
    }
  } catch (err) {
    throw err;
  }
};

export default validateMongodbObjectId;
