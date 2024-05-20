import bcryptHasher from 'bcrypt';
import CustomError from '../../errors/CustomError.js';

export default class UserModel {
  // Initialize idCounter variable to keep track of user IDs
  static idCounter = 0;

  // Initialize users array to store user instances
  static users = [];

  // Constructor to create user account/profile
  constructor(name, email, password) {
    this.id = ++UserModel.idCounter;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // Method to register a new user
  static signup(name, email, password) {
    const newUser = new UserModel(name, email, password);
    UserModel.users.push(newUser);
  }

  static signin(email, password) {
    // Find the target user
    const user = UserModel.users.find((u) => u.email == email);

    // If the user not found, throw an error to send failure response
    if (!user) {
      throw new CustomError('No account found with the provided email address!', 404, {
        requestData: { email, password },
      });
    }

    const hashedPassword = user.password; // Extract hashed password
    // Check if the provied password is valid
    const isPasswordValid = bcryptHasher.compareSync(password, hashedPassword);

    // If the user provided password is valid, return user details
    if (isPasswordValid) {
      return user;
    } else {
      //Otherwise, throw an custom error to send a failure response
      throw new CustomError('Incorrect password!', 400, { requestData: { email, password } });
    }
  }

  // Method to check if a specified user exists using email address
  static isExists(email) {
    return UserModel.users.some((u) => u.email === email);
  }
}

// Registering users
UserModel.signup('alpha', 'alpha@gmail.com', 'alpha@A1');
UserModel.signup('beta', 'beta@gmail.com', 'beta@A1');
UserModel.signup('gamma', 'gamma@gmail.com', 'gamma@A1');
UserModel.signup('delta', 'delta@gmail.com', 'delta@A1');
UserModel.signup('epsilon', 'epsilon@gmail.com', 'epsilon@A1');
UserModel.signup('zeta', 'zeta@gmail.com', 'zeta@A1');
UserModel.signup('eta', 'eta@gmail.com', 'eta@A1');
UserModel.signup('theta', 'theta@gmail.com', 'theta@A1');
UserModel.signup('iota', 'iota@gmail.com', 'iota@A1');
UserModel.signup('kappa', 'kappa@gmail.com', 'kappa@A1');
