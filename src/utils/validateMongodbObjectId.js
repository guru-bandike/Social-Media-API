import mongoose from 'mongoose';
import CustomError from '../errors/CustomError.js';

const validateMongodbObjectId = async (id, modelName) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id) || String(id).length !== 24) {
      throw new CustomError(`Invalid ${modelName} Id!`, 400, { [`${modelName}Id`]: id });
    }
  } catch (err) {
    throw err;
  }
};

export default validateMongodbObjectId;
