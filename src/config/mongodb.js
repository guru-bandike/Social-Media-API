import { MongoClient } from 'mongodb';

// Connection URL
const url = process.env.DB_URL;
const client = new MongoClient(url);

// Database Name
const dbName = 'social-media-db';
const connectToDb = async () => {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Successfully connected to DB');
  } catch (error) {
    console.log(error);
  }
};

const getDB = () => {
  return client.db(dbName);
};

export { connectToDb, getDB };
