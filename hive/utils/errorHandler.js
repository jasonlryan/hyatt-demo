/**
 * Centralized error handling for PeakMetrics integration
 */

class PeakMetricsError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'PeakMetricsError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

// Error codes
const ErrorCodes = {
  // Service errors
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  API_ERROR: 'API_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Data errors
  BRAND_NOT_FOUND: 'BRAND_NOT_FOUND',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
  DATA_PROCESSING_ERROR: 'DATA_PROCESSING_ERROR',
  
  // System errors
  CACHE_ERROR: 'CACHE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  FEATURE_DISABLED: 'FEATURE_DISABLED'
};

// Logger with different levels
const logger = {
  error: (message, error = null, context = {}) => {
    const log = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...context
    };
    
    if (error) {
      log.error = {
        message: error.message,
        stack: error.stack,
        code: error.code || 'UNKNOWN'
      };
    }
    
    console.error('❌ PeakMetrics Error:', JSON.stringify(log, null, 2));
  },
  
  warn: (message, context = {}) => {
    const log = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...context
    };
    
    console.warn('⚠️ PeakMetrics Warning:', JSON.stringify(log, null, 2));
  },
  
  info: (message, context = {}) => {
    const log = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...context
    };
    
    console.log('ℹ️ PeakMetrics Info:', JSON.stringify(log, null, 2));
  },
  
  debug: (message, context = {}) => {
    if (process.env.DEBUG === 'true') {
      const log = {
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        ...context
      };
      
      console.log('🔍 PeakMetrics Debug:', JSON.stringify(log, null, 2));
    }
  }
};

// Error handler middleware for Express
const errorMiddleware = (err, req, res, next) => {
  logger.error('Express middleware error', err, {
    method: req.method,
    url: req.url,
    ip: req.ip
  });

  if (err instanceof PeakMetricsError) {
    return res.status(getStatusCode(err.code)).json({
      error: err.toJSON()
    });
  }

  // Generic error response
  res.status(500).json({
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  });
};

// Get appropriate HTTP status code for error
function getStatusCode(errorCode) {
  switch (errorCode) {
    case ErrorCodes.SERVICE_UNAVAILABLE:
    case ErrorCodes.FEATURE_DISABLED:
      return 503;
    case ErrorCodes.AUTHENTICATION_FAILED:
      return 401;
    case ErrorCodes.BRAND_NOT_FOUND:
      return 404;
    case ErrorCodes.INVALID_PARAMETERS:
      return 400;
    case ErrorCodes.RATE_LIMIT_EXCEEDED:
      return 429;
    default:
      return 500;
  }
}

// Retry logic with exponential backoff
async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    onRetry = null
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      const delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay);
      
      if (onRetry) {
        onRetry(attempt + 1, delay, error);
      }
      
      logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, {
        error: error.message
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Circuit breaker implementation
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new PeakMetricsError(
          ErrorCodes.SERVICE_UNAVAILABLE,
          'Circuit breaker is OPEN - service temporarily unavailable'
        );
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    if (this.state !== 'CLOSED') {
      logger.info('Circuit breaker closed - service recovered');
      this.state = 'CLOSED';
    }
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      logger.error('Circuit breaker opened - too many failures', null, {
        failures: this.failures,
        nextAttempt: new Date(this.nextAttempt).toISOString()
      });
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      nextAttempt: this.state === 'OPEN' ? new Date(this.nextAttempt).toISOString() : null
    };
  }
}

module.exports = {
  PeakMetricsError,
  ErrorCodes,
  logger,
  errorMiddleware,
  retryWithBackoff,
  CircuitBreaker
};