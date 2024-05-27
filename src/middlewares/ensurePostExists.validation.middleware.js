import PostModel from '../features/post/post.model.js';
import CustomError from '../errors/CustomError.js';

const ensurePostExists = (req, res, next) => {
  const postId = req.params.postId;

  // Check post existence
  const isPostExists = PostModel.isExists(postId);

  // If post does not exist, throw a custom error to send failure response
  if (!isPostExists) {
    throw new CustomError('Post not found!', 404, { requestedPostId: postId });
  }

  next();
};

export default ensurePostExists;
