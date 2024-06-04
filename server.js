import './env.js';
import app from './app.js';
import { connectToDb } from './src/config/mongodb.js';

const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log('Server is listening on ' + port);
  connectToDb();
});
