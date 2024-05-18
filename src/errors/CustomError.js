export default class CustomError extends Error {
  // Construct custom error with provied data
  constructor(message, statusCode, inputData) {
    super(message);
    this.statusCode = statusCode;
    this.inputData = inputData;
  }
}
