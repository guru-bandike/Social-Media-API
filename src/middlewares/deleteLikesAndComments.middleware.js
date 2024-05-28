import LikeModel from '../features/like/like.model.js';
import CommentModel from '../features/comment/comment.model.js';

const deleteLikesAndComments = (req, res) => {
  const postId = parseInt(req.params.id);

  LikeModel.deleteByPostId(postId);
  CommentModel.deleteByPostId(postId);
};

export default deleteLikesAndComments;
