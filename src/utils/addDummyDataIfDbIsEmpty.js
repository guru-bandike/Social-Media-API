import mongoose from 'mongoose';
import logError from './errorLogger.js';

const addData = async () => {};

const addDummyDataIfDbIsEmpty = async () => {
  try {
    const db = mongoose.connection.db;
    const existingCollections = await db.listCollections().toArray();

    if (existingCollections.length === 0) {
      await addData();
    }
  } catch (err) {
    logError(err);
  }
};
export default addDummyDataIfDbIsEmpty;
