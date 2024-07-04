import CustomError from '../errors/CustomError.js';
import { PostModel } from '../features/post/post.model.js';
import validateMongodbObjectId from '../utils/validateMongodbObjectId.js';

const verifyPostOwnership = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.userId;

  try {
    // Validate post id
    await validateMongodbObjectId(postId, 'post');

    // Find target post
    const post = await PostModel.findById(postId);

    // If post does not exist, send failure response
    if (!post) return next(new CustomError('Post not found!', 404, { postId }));

    // If the user is not the Owner of the post, send failure response
    if (!post.userId == userId)
      return next(new CustomError('User is not the Owner/Author of the post!', 401));

    next();
  } catch (err) {
    next(err);
  }
};

export default verifyPostOwnership;
