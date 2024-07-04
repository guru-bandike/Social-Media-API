import mongoose from 'mongoose';
import CustomError from '../errors/CustomError.js';

const validateMongodbObjectId = async (id, modelName) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new CustomError(`Invalid ${modelName} Id!`, 400, { id });
  } catch (err) {
    throw err;
  }
};

export default validateMongodbObjectId;
