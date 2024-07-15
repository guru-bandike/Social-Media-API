import express from 'express';
import FriendshipController from './friendship.controller.js';

// Create express router instance for handling Friendship related routes
const friendshipRouter = express.Router();

// Create Friendship controller for handling Friendship related operations
const friendshipController = new FriendshipController();

friendshipRouter.post('/toggle-friendship/:targetId', (req, res, next) => {
  friendshipController.toggleFriendship(req, res, next);
}); // Route to toggle friendship status with specific user

friendshipRouter.get('/get-friends/:userId', (req, res, next) => {
  friendshipController.getFriendsByUserId(req, res, next);
}); // Route to get any user's friends

friendshipRouter.get('/get-friendships', (req, res, next) => {
  friendshipController.getFriendships(req, res, next);
}); // Route to get any user's friendships

friendshipRouter.get('/get-sent-pending-friend-reqs', (req, res, next) => {
  friendshipController.getSentPendingFriendReqs(req, res, next);
}); // Route to get user's sent pending friend requests

friendshipRouter.get('/get-received-pending-friend-reqs', (req, res, next) => {
  friendshipController.getReceivedPendingFriendReqs(req, res, next);
}); // Route to get user's received pending friend requests

friendshipRouter.post('/respond-to-received-pending-friend-req/:friendshipId', (req, res, next) => {
  friendshipController.respondToReceivedPendingFriendReq(req, res, next);
}); // Route to respond user's received pending friend request

export default friendshipRouter;
