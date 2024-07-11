import mongoose from 'mongoose';
import { PostModel } from '../post/post.model.js';
import { CommentModel } from '../comment/comment.model.js';

const validTargetTypes = ['post', 'comment'];

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required!'],
  },
  targetType: {
    type: String,
    required: [true, 'Target type is required!'],
    set: (v) => v.toString().toLowerCase(), // Ensure targetType is always stored in lowercase
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'targetType',
    required: [true, 'Target ID is required!'],
  },
});

// -------------------------------- Validators section: Start -------------------------------- //

// Validator to ensure targetType is valid
likeSchema.path('targetType').validate(function (targetType) {
  if (validTargetTypes.includes(targetType)) return true; // Return true if targetType is valid
  else return false; // Return false if targetType is invalid
}, 'Invalid target Type!');

// validator to ensure targetId exists in the appropriate collection
likeSchema.path('targetId').validate(async function (targetId) {
  if (!validTargetTypes.includes(this.targetType)) return; // Skip validation if targetType is invalid

  // If like is for 'post', ensure post exists
  if (this.targetType === 'post') return !!(await PostModel.findById(targetId));
  //IF like is for 'comment', ensure comment exists
  if (this.targetType === 'comment') return !!(await CommentModel.findById(targetId));
}, 'Invalid target ID!');

// -------------------------------- Validators section: End -------------------------------- //

const LikeModel = mongoose.model('like', likeSchema);

export default LikeModel;
