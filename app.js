// Import necessary External modules
import express from 'express';

// Import necessary internal modules
import userRouter from './src/features/user/user.routes.js';
import postRouter from './src/features/post/post.routes.js';
import authUser from './src/middlewares/auth-user.middleware.js';
import welcomeUser from './src/middlewares/welcomeUser.middleware.js';
import handleErrors from './src/middlewares/errorHandler.middleware.js';
import handleInvalidRoute from './src/middlewares/invalidRouteHandler.middleware.js';

// Create server using Express
const app = express();

app.use(express.json());

// Welcome user on home route
app.get('/', welcomeUser);

// Mount the userRouter for handling user related requests
app.use('/user', userRouter);

// Mount the postRouter for handling post related requests
app.use('/posts', authUser, postRouter);

// Handle invalid routes
app.use(handleInvalidRoute);

// Handle all application errors
app.use(handleErrors);

export default app;
