import LikeModel from './like.model.js';

export default class LikeController {
  // Method to toggle like
  toggle(req, res) {
    const userId = req.userId;
    const postId = parseInt(req.params.postId);

    LikeModel.toggle(userId, postId);
    res.status(200).json({ success: true, message: 'Post has been successfully toggled' });
  }
  // Method to get all likes of a particular post
  getByPostId(req, res) {
    const postId = req.params.postId;
    const postLikes = LikeModel.getByPostId(postId);
    res
      .status(200)
      .json({ success: true, message: 'Post likes has been successfully retrieved', postLikes });
  }
}
