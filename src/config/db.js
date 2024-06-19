import mongoose from 'mongoose';
import logError from '../utils/errorLogger.js';

// Database Name
const dbName = 'social-media-db';

const connectToMongoDbAtlas = async () => {
  try {
    const atlasUserName = process.env.MONGODB_ATLAS_USER_NAME;
    const atlasPassword = process.env.MONGODB_ATLAS_USER_PASSWORD;
    const url = `mongodb+srv://${atlasUserName}:${atlasPassword}@cluster0.xvzfzw2.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(url);
    console.log('Successfully connected to MongoDB Atlas using Mongoose.');
  } catch (err) {
    logError(err);
  }
};

const connectToMongoDBCommunity = async () => {
  try {
    const url = process.env.MONGODB_COMMUNITY_URL || 'mongodb://localhost:27017';

    await mongoose.connect(`${url}/${dbName}`);
    console.log('Successfully connected to MongoDB Community using Mongoose.');
  } catch (err) {
    logError(err);
  }
};

export { connectToMongoDbAtlas, connectToMongoDBCommunity };
