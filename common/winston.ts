import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

import { getProjectRoot } from './ProjectUtils';

const { combine, colorize, printf, errors } = winston.format;

// Create the logs directory.
const logsPath = path.join(getProjectRoot(), 'logs');
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath);
}

// Logging format
const myFormat = printf(({ level, message, stack }) => {
  let output = `${level}: ${message}`;
  if (stack) {
    output += `\n${stack}`;
  }
  return output;
});

// Winston initialization
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }), // <-- use errors format
    colorize({ level: true, colors: { info: 'blue', error: 'red' } }),
    myFormat,
  ),
});

/**
 * If we're not in production then log to the `console` with the format:
 * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

/**
 * If in production, then log to the `file` with the format:
 * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: './logs/combined.log',
      handleExceptions: true,
    }),
  );
}

export default logger;
