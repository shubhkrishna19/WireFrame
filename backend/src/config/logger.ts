// ============================================
// LOGGING CONFIGURATION (Winston)
// ============================================

import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { config } from './env';

// Ensure logs directory exists
const logsDir = config.logging.filePath;
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format (for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0 && meta.stack) {
      msg += `\n${meta.stack}`;
    } else if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Create Winston logger
export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'mulary-backend' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: parseInt(config.logging.maxSize) || 10485760, // 10MB
      maxFiles: parseInt(config.logging.maxFiles) || 7,
    }),
    
    // Write all errors to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: parseInt(config.logging.maxSize) || 10485760,
      maxFiles: parseInt(config.logging.maxFiles) || 7,
    }),
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
    }),
  ],
});

// Add console transport in development
if (config.isDevelopment) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Helper functions for structured logging
export const logRequest = (req: any) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
};

export const logResponse = (req: any, res: any, duration: number) => {
  logger.info('HTTP Response', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
  });
};

export const logError = (error: Error, req?: any) => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    ...(req && {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
    }),
  });
};

export const logDatabase = (query: string, duration: number) => {
  logger.debug('Database Query', {
    query,
    duration: `${duration}ms`,
  });
};

export const logPayment = (orderId: string, amount: number, status: string) => {
  logger.info('Payment Transaction', {
    orderId,
    amount,
    status,
  });
};

export const logEmail = (to: string, subject: string, status: 'sent' | 'failed') => {
  logger.info('Email', {
    to,
    subject,
    status,
  });
};

// Export logger as default
export default logger;
