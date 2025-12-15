/**
 * Custom logger for production environments
 */
class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Format log message with timestamp
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    return JSON.stringify(logEntry);
  }

  /**
   * Log info messages
   */
  info(message, meta = {}) {
    if (this.isDevelopment) {
      console.log(`ℹ️  ${message}`, meta);
    } else {
      console.log(this.formatMessage('info', message, meta));
    }
  }

  /**
   * Log error messages
   */
  error(message, error = null, meta = {}) {
    const errorMeta = {
      ...meta,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null
    };

    if (this.isDevelopment) {
      console.error(`❌ ${message}`, errorMeta);
    } else {
      console.error(this.formatMessage('error', message, errorMeta));
    }
  }

  /**
   * Log warning messages
   */
  warn(message, meta = {}) {
    if (this.isDevelopment) {
      console.warn(`⚠️  ${message}`, meta);
    } else {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message, meta = {}) {
    if (this.isDevelopment) {
      console.debug(`🔍 ${message}`, meta);
    }
  }

  /**
   * Log HTTP requests
   */
  request(req, res, duration) {
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    if (res.statusCode >= 400) {
      this.warn('HTTP Request Error', logData);
    } else if (this.isDevelopment) {
      this.info('HTTP Request', logData);
    }
  }
}

const logger = new Logger();

/**
 * Express middleware for request logging
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.request(req, res, duration);
  });

  next();
};

module.exports = { logger, requestLogger };
