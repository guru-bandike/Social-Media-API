// Import necessary External modules
import express from 'express';

// Import necessary internal modules
import userRouter from './src/features/user/user.routes.js';
import postRouter from './src/features/post/post.routes.js';
import likeRouter from './src/features/like/like.routes.js';
import commentRouter from './src/features/comment/comment.routes.js';
import authUser from './src/middlewares/auth-user.middleware.js';
import welcomeUser from './src/middlewares/welcomeUser.middleware.js';
import logRequest from './src/middlewares/logRequest.middleware.js';
import handleApplicationLevelErrors from './src/middlewares/applicationLevelErrorHandler.middleware.js';
import handleInvalidRoute from './src/middlewares/invalidRouteHandler.middleware.js';

// Create server using Express
const app = express();

app.use(express.json()); // Parse incoming JSON bodies
app.use(logRequest); // Log every request exept user routes

// Welcome user on home route
app.get('/', welcomeUser);

// Mount the userRouter for handling user related requests
app.use('/user', userRouter);

// Mount the postRouter for handling post related requests
app.use('/posts', authUser, postRouter);

// Mount the likeRouter for handling likes related requests
app.use('/likes', authUser, likeRouter);

// Mount the commentRouter for handling comments related requests
app.use('/comments', authUser, commentRouter);

// Handle invalid routes
app.use(handleInvalidRoute);

// Handle all application errors
app.use(handleApplicationLevelErrors);

export default app;
