// Import necessary External modules
import express from 'express';

// Import necessary internal modules
import welcomeUser from './src/middlewares/welcomeUser.middleware.js';

// Create server using Express
const app = express();

// Welcome user on home route
app.get('/', welcomeUser);

export default app;
