import CustomError from '../errors/CustomError.js';
import validateMongodbObjectId from '../utils/validateMongodbObjectId.js';

const validTargetTypes = ['post', 'comment'];

const validateToggleLikeReq = async (req, res, next) => {
  const targetId = req.params.id;
  const targetType = req.body.targetType;

  try {
    // If target type is not given, send failure response
    if (!targetType) return next(new CustomError('Target type is requred!', 400));

    // If target type is invalid, send failure response
    if (!validTargetTypes.includes(targetType.toString().toLowerCase()))
      // If target type is not valid, send failure response
      return next(
        new CustomError(`Only 'post' and 'comment' are valid target types!`, 400, {
          receivedTargetType: targetType,
        })
      );

    // Validate target id
    await validateMongodbObjectId(targetId, targetType);

    // If request validation has been completed, call to next middleware
    next();
  } catch (err) {
    next(err);
  }
};

export default validateToggleLikeReq;
