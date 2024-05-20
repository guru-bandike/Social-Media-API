import bcryptHasher from 'bcrypt';

// Middleware to hash passwords
const hashPassword = async (req, res, next) => {
  const { password } = req.body; // Extract user entered passoword

  /**
   * Define salt rounds
   * Salt rounds add randomness to hashed passwords, enhancing security against brute-force attacks.
   * The more number of rounds - more security - more computional time
   * The less number of rounds - less security - less computaional time
   */
  const saltRounds = 10;

  try {
    // Hash password
    await bcryptHasher.hash(password, saltRounds).then((hashedPassword) => {
      // Replace the user enterd password with hashed password
      req.body.password = hashedPassword;
      next(); // proceed to the next middleware
    });
  } catch (err) {
    /**
     * If there are any errors,
     * Pass error to the next() function so that Express's error-handling middleware can detect and handle it appropriately.
     */
    next(err);
  }
};

export default hashPassword;
