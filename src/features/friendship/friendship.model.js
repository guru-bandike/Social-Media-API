import mongoose from 'mongoose';
import { UserModel } from '../user/user.model.js';

const validStatuses = ['pending', 'accepted', 'rejected'];

const friendshipSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Requester ID is required!'],
  },
  approverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Approver/Target ID is required!'],
  },
  status: {
    type: String,
    default: 'pending',
    set: (v) => v.toString().toLowerCase(), // Ensure status is always stored in lowercase
  },
});

// -------------------------------- Validators section: Start -------------------------------- //

// Validator to ensure approver exists
friendshipSchema.path('approverId').validate(async function (approverId) {
  return Boolean(await UserModel.findById(approverId));
}, 'Invalid approver ID!');

// Validator to ensure status
friendshipSchema
  .path('status')
  .validate((status) => validStatuses.includes(status), 'Invalid status!');

// -------------------------------- Validators section: end -------------------------------- //

export const FriendshipModel = mongoose.model('friendship', friendshipSchema);
