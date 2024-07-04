import PostRepository from '../features/post/post.repository.js';
import CustomError from '../errors/CustomError.js';

const postRepo = new PostRepository();

const verifyPostOwnership = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.userId;

  // Find target post
  const post = await postRepo.getById(postId);

  // If post does not exist, send failure response
  if (!post) return next(new CustomError('Post not found!', 404, { postId }));

  // If the user is not the Owner of the post, send failure response
  if (!post.userId == userId)
    return next(new CustomError('User is not the Owner/Author of the post!', 401));

  next();
};

export default verifyPostOwnership;
