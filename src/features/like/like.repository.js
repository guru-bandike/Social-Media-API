import LikeModel from './like.model.js';

export default class LikeRepository {
  // Method to toggle like
  async toggle(userId, targetId, targetType) {
    try {
      // Attemt to delete target like
      const deletedLike = await LikeModel.findOneAndDelete({ userId, targetId });

      // If no like was deleted, create new one
      if (!deletedLike) {
        const newLike = await LikeModel.create({ userId, targetId, targetType });
        return { performedOperatoin: 'Creation', newLike };
      }

      // If like was deleted, return deleted like
      return { performedOperatoin: 'Deletion', deletedLike };
    } catch (err) {
      throw err;
    }
  }

  // Method to get all target likes
  async getLikes(targetId) {
    try {
      return await LikeModel.find({ targetId });
    } catch (err) {
      throw err;
    }
  }
}
