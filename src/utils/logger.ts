import { config } from '../config/environment';

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Log level priorities
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

/**
 * Check if a log level should be displayed based on the configured log level
 * @param level Log level to check
 * @returns Whether the log level should be displayed
 */
const shouldLog = (level: LogLevel): boolean => {
  const configuredLevel = (config.logLevel as LogLevel) || LogLevel.INFO;
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[configuredLevel];
};

/**
 * Format a log message
 * @param level Log level
 * @param message Log message
 * @param meta Additional metadata
 * @returns Formatted log message
 */
const formatLog = (level: LogLevel, message: string, meta?: any): string => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
};

/**
 * Logger utility
 */
export const logger = {
  /**
   * Log a debug message
   * @param message Log message
   * @param meta Additional metadata
   */
  debug: (message: string, meta?: any): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(formatLog(LogLevel.DEBUG, message, meta));
    }
  },

  /**
   * Log an info message
   * @param message Log message
   * @param meta Additional metadata
   */
  info: (message: string, meta?: any): void => {
    if (shouldLog(LogLevel.INFO)) {
      console.info(formatLog(LogLevel.INFO, message, meta));
    }
  },

  /**
   * Log a warning message
   * @param message Log message
   * @param meta Additional metadata
   */
  warn: (message: string, meta?: any): void => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatLog(LogLevel.WARN, message, meta));
    }
  },

  /**
   * Log an error message
   * @param message Log message
   * @param meta Additional metadata
   */
  error: (message: string, meta?: any): void => {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(formatLog(LogLevel.ERROR, message, meta));
    }
  },
};
