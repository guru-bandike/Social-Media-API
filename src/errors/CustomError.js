export default class CustomError extends Error {
  // Construct custom error with provied data
  constructor(message, statusCode, dataObj) {
    super(message);
    this.statusCode = statusCode;
    this.dataObj = dataObj;
  }
}
