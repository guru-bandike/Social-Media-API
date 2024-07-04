import CustomError from '../errors/CustomError.js';

const validateUpdatePostReq = (req, res, next) => {
  const postMedia = req.file;
  const postCaption = req.body.caption;

  if (!postMedia && !postCaption)
    return next(
      new CustomError('Either post media or post caption must be provided to update the post!', 400)
    );

  next();
};

export default validateUpdatePostReq;
