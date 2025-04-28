const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file');

// Ensure the log directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Custom format to include user information
const myFormat = printf(({ level, message, timestamp, user, ...metadata }) => {
  let log = `${timestamp} [${level}]${user ? ` [user: ${user}]` : ''}: ${message}`;
  if (metadata.request) {
    log += `\nRequest: ${JSON.stringify(metadata.request, null, 2)}`;
  }
  if (metadata.response) {
    log += `\nResponse: ${JSON.stringify(metadata.response, null, 2)}`;
  }
  return log;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDir, '%DATE%-info.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
    }),
    new DailyRotateFile({
      filename: path.join(logDir, '%DATE%-error.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error'
    })
  ]
});

// Function to log error details
const logErrorDetails = (error, context) => {
  logger.error(`${context}: ${error.response?.data?.message || error.message}`, {
    request: {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      data: error.config?.data,
    },
    response: {
      status: error.response?.status,
      data: error.response?.data,
    },
  });
};

module.exports = { logger, logErrorDetails };
