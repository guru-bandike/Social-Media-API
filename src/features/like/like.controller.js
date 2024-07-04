import LikeRepository from './like.repository.js';
import validateMongodbObjectId from '../../utils/validateMongodbObjectId.js';

export default class LikeController {
  constructor() {
    this.likeRepo = new LikeRepository();
  }

  // Method to toggle like
  async toggle(req, res, next) {
    const userId = req.userId;
    const targetId = req.params.id;
    const targetType = req.body.targetType;

    try {
      // Tolggle like
      const result = await this.likeRepo.toggle(userId, targetId, targetType);

      // If like has been added, send creation response
      if (result.performedOperatoin === 'Creation')
        return res.status(201).json({
          success: true,
          message: `Like has been successfully added to ${targetType}`,
          performedOperatoin: result.performedOperatoin,
          like: result.newLike,
        });

      // If like has been removed, send deletion response
      res.status(200).json({
        success: true,
        message: `Like has been successfully removed from ${targetType}`,
        performedOperatoin: result.performedOperatoin,
        like: result.deletedLike,
      });
    } catch (err) {
      next(err);
    }
  }
  // Method to get all likes of a particular post or comment
  async getlikes(req, res, next) {
    const targetId = req.params.id;
    try {
      // Validate target id
      await validateMongodbObjectId(targetId, 'post or comment');

      const likes = await this.likeRepo.getLikes(targetId);
      res
        .status(200)
        .json({ success: true, message: 'Likes has been successfully retrieved', likes });
    } catch (err) {
      next(err);
    }
  }
}
