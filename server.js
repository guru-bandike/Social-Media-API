import './env.js';
import app from './app.js';
import { connectToMongoDbAtlas, connectToMongoDBCommunity } from './src/config/db.js';
import addDummyDataIfDbIsEmpty from './src/utils/addDummyDataIfDbIsEmpty.js';

const port = process.env.PORT || 5000;

// Start the server
app.listen(port, async () => {
  console.log('Server is listening on ' + port);
  await connectToMongoDbAtlas();
  await addDummyDataIfDbIsEmpty();
});
