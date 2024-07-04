import mongoose from 'mongoose';
import CustomError from '../errors/CustomError.js';

const validTargetTypes = ['post', 'comment'];

const validateToggleLikeReq = (req, res, next) => {
  const targetId = req.params.id;
  const targetType = req.body.targetType;

  try {
    // If the target id is invalid, send failure response
    if (!mongoose.Types.ObjectId.isValid(targetId))
      return next(new CustomError('Invalid target ID!', 400, { receivedTargetId: targetId }));

    // If target type is not given, send failure response
    if (!targetType)
      return next(
        new CustomError('Target type is requred!', 400, { receivedTargetType: targetType })
      );

    if (!validTargetTypes.includes(targetType.toString().toLowerCase()))
      // If target type is not valid, send failure response
      return next(
        new CustomError(`Only 'post' and 'comment' are valid target types!`, 400, {
          receivedTargetType: targetType,
        })
      );

    // If request validation has been completed, call to next middleware
    next();
  } catch (err) {
    next(err);
  }
};

export default validateToggleLikeReq;
