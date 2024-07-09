const deleteLikesAndComments = (req, res) => {
  const postId = parseInt(req.params.id);

  LikeModel.deleteByPostId(postId);
  CommentModel.deleteByPostId(postId);
};

export default deleteLikesAndComments;
