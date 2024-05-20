import jwt from 'jsonwebtoken';

const generateJwtToken = (PayloadDataObj) => {
  // Define secret key
  const secretKey = 'CF742367BEDA4F17CBA4995B999CF';

  // Generat JWT token
  const token = jwt.sign(PayloadDataObj, secretKey, { expiresIn: '7d' });

  return token;
};

export default generateJwtToken;
