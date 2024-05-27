import jwt from 'jsonwebtoken';
import CustomError from '../errors/CustomError.js';

// Define JWT authentication middleware
const authUser = (req, res, next) => {
  // Extract token
  const token = req.headers['authorization'];

  // If token not found, throw custom error to send failure response
  if (!token) {
    throw new CustomError('Token not found!', 401);
  }

  try {
    const secretKey = '2EA9EFB2A59DA773AEB58A8CA52A7';
    // Verify token using JWT
    const payload = jwt.verify(token, secretKey);

    // Attach user id to incoming request body for further usage
    req.userId = payload.userId;
  } catch (err) {
    // Handle token expairation error
    if (err.name == 'TokenExpiredError') {
      throw new CustomError('Token Expaired!', 401);
    }

    // Handle token invalid error
    if (err.name == 'JsonWebTokenError') {
      throw new CustomError('Invalid Token!', 401);
    }

    // Send unauthorized error for other errors
    throw new CustomError('Unauthorized!', 401);
  }

  // Call the next middleware if token is valid
  next();
};

// Export JWT authentication middleware as default
export default authUser;
