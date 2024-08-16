import * as winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// Define custom log levels
const customLevels = {
  levels: {
    error: 0,
    info: 1,
    debug: 2,
  },
  colors: {
    error: 'red',
    info: 'blue',
    debug: 'yellow',
  },
};

// Apply the custom colors to winston
winston.addColors(customLevels.colors);

// Define the log format
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.splat(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

// Function to get the current month name and day name
const getCurrentDateInfo = (date: Date) => {
  const year = date.getFullYear();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const month = monthNames[date.getMonth()];
  const day = dayNames[date.getDay()];
  return { year, month, day };
};

// Create a function to generate the log file path
const generateLogFilePath = () => {
  const date = new Date();
  const { year, month, day } = getCurrentDateInfo(date);
  return path.join('logs', year.toString(), month, day);
};

// Create a Winston logger instance
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: logFormat,
  transports: [
    new winston.transports.DailyRotateFile({
      filename: generateLogFilePath(),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'debug',
    }),
    new winston.transports.Console({
      level: 'debug',
    }),
  ],
});

export default logger;