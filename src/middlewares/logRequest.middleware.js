import { createLogger, format, transports } from 'winston';

// Create a Winston logger instance
const logger = createLogger({
  // Set logging level to 'info'
  level: 'info',
  // Define log format
  format: format.combine(
    // Include timestamp in logs with specified format
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Customize log message format
    format.printf((info) => `${info.timestamp} ${info.level} : ${info.message}`)
  ),
  // Specify transport options, such as writing logs to a file
  transports: [new transports.File({ filename: 'requests.log' })],
});

// Middleware function for logging request details
const logRequest = (req, res, next) => {
  // Extract method and URL from the request object
  const { method, originalUrl, body } = req;

  // If request is a user related, skip logging request
  if (originalUrl.startsWith('/api/users')) return next();

  if (originalUrl.startsWith('/api/posts') && (method == 'POST' || method == 'PUT')) {
    if (!req.isParsingDone) return next();
  }

  // Log the request method and URL
  logger.info(`Method: ${method}, URL: ${originalUrl}, Body: ${JSON.stringify(body)}`);
  // Continue to the next middleware
  next();
};

export default logRequest;
