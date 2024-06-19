import jwt from 'jsonwebtoken';

const generateJwtToken = (PayloadDataObj) => {
  // Define secret key
  const secretKey = process.env.JWT_SECRET;

  // Generat JWT token
  const token = jwt.sign(PayloadDataObj, secretKey, { expiresIn: '7d' });

  return token;
};

export default generateJwtToken;
