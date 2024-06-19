import { createLogger, format, transports } from 'winston';

// Create a Winston logger instance
const logger = createLogger({
  // Set logging level to 'error'
  level: 'error',
  // Define log format
  format: format.combine(
    // Include timestamp in logs with specified format
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Customize log message format
    format.printf((err) => `${err.timestamp} ${err.stack}`)
  ),
  // Specify transport options, such as writing logs to a file
  transports: [new transports.File({ filename: 'error.log' })],
});


const logError = (err) => {
  logger.error(err);
};

export default logError;
