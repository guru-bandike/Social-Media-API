// Import necessary External modules
import express from 'express';

// Import necessary internal modules
import welcomeUser from './src/middlewares/welcomeUser.middleware.js';
import handleErrors from './src/middlewares/errorHandler.middleware.js';
import handleInvalidRoute from './src/middlewares/invalidRouteHandler.middleware.js';

// Create server using Express
const app = express();

// Welcome user on home route
app.get('/', welcomeUser);

// Handle invalid routes
app.use(handleInvalidRoute);

// Handle all application errors
app.use(handleErrors);

export default app;
