/**
 * Centralized error handling utilities for API operations
 */

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  endpoint?: string;
}

export class MondayApiError extends Error {
  public code: string;
  public details?: any;
  public endpoint?: string;
  public timestamp: Date;

  constructor(code: string, message: string, details?: any, endpoint?: string) {
    super(message);
    this.name = 'MondayApiError';
    this.code = code;
    this.details = details;
    this.endpoint = endpoint;
    this.timestamp = new Date();
  }
}

export const ERROR_CODES = {
  // Authentication Errors
  INVALID_API_KEY: 'INVALID_API_KEY',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_REFUSED: 'CONNECTION_REFUSED',
  
  // Data Errors
  INVALID_BOARD_ID: 'INVALID_BOARD_ID',
  MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
  INVALID_COLUMN_TYPE: 'INVALID_COLUMN_TYPE',
  DATA_VALIDATION_ERROR: 'DATA_VALIDATION_ERROR',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // Server Errors
  MONDAY_SERVER_ERROR: 'MONDAY_SERVER_ERROR',
  PROXY_ERROR: 'PROXY_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_API_KEY]: 'Invalid Monday.com API key. Please check your credentials.',
  [ERROR_CODES.EXPIRED_TOKEN]: 'API token has expired. Please refresh your authentication.',
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions to perform this action.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_CODES.CONNECTION_REFUSED]: 'Unable to connect to Monday.com servers.',
  [ERROR_CODES.INVALID_BOARD_ID]: 'Invalid board ID. Please verify the board configuration.',
  [ERROR_CODES.MISSING_REQUIRED_FIELDS]: 'Required fields are missing. Please fill in all required information.',
  [ERROR_CODES.INVALID_COLUMN_TYPE]: 'Invalid column type for the provided data.',
  [ERROR_CODES.DATA_VALIDATION_ERROR]: 'Data validation failed. Please check your input.',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please wait before making more requests.',
  [ERROR_CODES.QUOTA_EXCEEDED]: 'API quota exceeded. Please upgrade your plan or wait for reset.',
  [ERROR_CODES.MONDAY_SERVER_ERROR]: 'Monday.com server error. Please try again later.',
  [ERROR_CODES.PROXY_ERROR]: 'Proxy server error. Please contact support.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
};

/**
 * Parse Monday.com API errors and return standardized error objects
 */
export function parseMondayError(error: any, endpoint?: string): MondayApiError {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new MondayApiError(
      ERROR_CODES.NETWORK_ERROR,
      ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      error,
      endpoint
    );
  }

  // Timeout errors
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return new MondayApiError(
      ERROR_CODES.TIMEOUT_ERROR,
      ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR],
      error,
      endpoint
    );
  }

  // Monday.com GraphQL errors
  if (error.errors && Array.isArray(error.errors)) {
    const firstError = error.errors[0];
    
    // Authentication errors
    if (firstError.message.includes('authentication') || firstError.message.includes('unauthorized')) {
      return new MondayApiError(
        ERROR_CODES.INVALID_API_KEY,
        ERROR_MESSAGES[ERROR_CODES.INVALID_API_KEY],
        error,
        endpoint
      );
    }
    
    // Permission errors
    if (firstError.message.includes('permission') || firstError.message.includes('access')) {
      return new MondayApiError(
        ERROR_CODES.INSUFFICIENT_PERMISSIONS,
        ERROR_MESSAGES[ERROR_CODES.INSUFFICIENT_PERMISSIONS],
        error,
        endpoint
      );
    }
    
    // Board errors
    if (firstError.message.includes('board') && firstError.message.includes('not found')) {
      return new MondayApiError(
        ERROR_CODES.INVALID_BOARD_ID,
        ERROR_MESSAGES[ERROR_CODES.INVALID_BOARD_ID],
        error,
        endpoint
      );
    }
    
    // Rate limiting
    if (firstError.message.includes('rate limit') || firstError.message.includes('too many requests')) {
      return new MondayApiError(
        ERROR_CODES.RATE_LIMIT_EXCEEDED,
        ERROR_MESSAGES[ERROR_CODES.RATE_LIMIT_EXCEEDED],
        error,
        endpoint
      );
    }
    
    // Generic GraphQL error
    return new MondayApiError(
      ERROR_CODES.DATA_VALIDATION_ERROR,
      firstError.message || ERROR_MESSAGES[ERROR_CODES.DATA_VALIDATION_ERROR],
      error,
      endpoint
    );
  }

  // HTTP status errors
  if (error.status) {
    switch (error.status) {
      case 401:
        return new MondayApiError(
          ERROR_CODES.INVALID_API_KEY,
          ERROR_MESSAGES[ERROR_CODES.INVALID_API_KEY],
          error,
          endpoint
        );
      case 403:
        return new MondayApiError(
          ERROR_CODES.INSUFFICIENT_PERMISSIONS,
          ERROR_MESSAGES[ERROR_CODES.INSUFFICIENT_PERMISSIONS],
          error,
          endpoint
        );
      case 429:
        return new MondayApiError(
          ERROR_CODES.RATE_LIMIT_EXCEEDED,
          ERROR_MESSAGES[ERROR_CODES.RATE_LIMIT_EXCEEDED],
          error,
          endpoint
        );
      case 500:
      case 502:
      case 503:
        return new MondayApiError(
          ERROR_CODES.MONDAY_SERVER_ERROR,
          ERROR_MESSAGES[ERROR_CODES.MONDAY_SERVER_ERROR],
          error,
          endpoint
        );
      default:
        return new MondayApiError(
          ERROR_CODES.UNKNOWN_ERROR,
          `HTTP ${error.status}: ${error.statusText || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]}`,
          error,
          endpoint
        );
    }
  }

  // Generic error fallback
  return new MondayApiError(
    ERROR_CODES.UNKNOWN_ERROR,
    error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    error,
    endpoint
  );
}

/**
 * Log errors for monitoring and debugging
 */
export function logError(error: MondayApiError): void {
  console.group(`🔴 Monday API Error: ${error.code}`);
  console.error('Message:', error.message);
  console.error('Endpoint:', error.endpoint);
  console.error('Timestamp:', error.timestamp.toISOString());
  console.error('Details:', error.details);
  console.groupEnd();
  
  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    // Example: Send to monitoring service
    // sendToMonitoringService(error);
  }
}

/**
 * Retry logic for API calls
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on authentication or permission errors
      if (error instanceof MondayApiError) {
        if ([
          ERROR_CODES.INVALID_API_KEY,
          ERROR_CODES.INSUFFICIENT_PERMISSIONS,
          ERROR_CODES.INVALID_BOARD_ID
        ].includes(error.code as any)) {
          throw error;
        }
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}</parameter>