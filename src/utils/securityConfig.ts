/**
 * Security configuration and API key management
 */

interface SecurityConfig {
  apiKeyRotationDays: number;
  maxRetryAttempts: number;
  requestTimeoutMs: number;
  rateLimitPerMinute: number;
  enableApiKeyValidation: boolean;
  enableRequestLogging: boolean;
}

const SECURITY_CONFIG: SecurityConfig = {
  apiKeyRotationDays: 90,
  maxRetryAttempts: 3,
  requestTimeoutMs: 30000,
  rateLimitPerMinute: 60,
  enableApiKeyValidation: true,
  enableRequestLogging: import.meta.env.DEV
};

/**
 * Rate limiting implementation
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = SECURITY_CONFIG.rateLimitPerMinute, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // Check if we're under the limit
    if (this.requests.length >= this.limit) {
      return false;
    }
    
    // Add current request
    this.requests.push(now);
    return true;
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const timeUntilReset = this.windowMs - (Date.now() - oldestRequest);
    
    return Math.max(0, timeUntilReset);
  }
}

// Global rate limiter instances
const mondayRateLimiter = new RateLimiter(50, 60000); // 50 requests per minute
const ghostRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

/**
 * Check rate limit before making API calls
 */
export function checkRateLimit(apiType: 'monday' | 'ghost'): void {
  const limiter = apiType === 'monday' ? mondayRateLimiter : ghostRateLimiter;
  
  if (!limiter.canMakeRequest()) {
    const resetTime = limiter.getTimeUntilReset();
    throw new Error(`Rate limit exceeded for ${apiType} API. Try again in ${Math.ceil(resetTime / 1000)} seconds.`);
  }
}

/**
 * Sanitize and validate input data
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .substring(0, 1000); // Limit length
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      // Validate key names
      if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
        sanitized[key] = sanitizeInput(value);
      }
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid length (7-15 digits)
  return cleaned.length >= 7 && cleaned.length <= 15;
}

/**
 * Secure logging function that redacts sensitive information
 */
export function secureLog(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
  if (!SECURITY_CONFIG.enableRequestLogging && import.meta.env.PROD) {
    return;
  }

  const timestamp = new Date().toISOString();
  const logData = data ? redactSensitiveData(data) : undefined;
  
  const logEntry = {
    timestamp,
    level,
    message,
    data: logData
  };

  switch (level) {
    case 'info':
      console.info('🔵', logEntry);
      break;
    case 'warn':
      console.warn('🟡', logEntry);
      break;
    case 'error':
      console.error('🔴', logEntry);
      break;
  }
}

/**
 * Redact sensitive information from log data
 */
function redactSensitiveData(data: any): any {
  if (typeof data === 'string') {
    // Redact potential API keys, tokens, passwords
    return data.replace(/([a-zA-Z0-9]{20,})/g, '[REDACTED]');
  }
  
  if (typeof data === 'object' && data !== null) {
    const redacted: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      
      if (lowerKey.includes('key') || 
          lowerKey.includes('token') || 
          lowerKey.includes('password') || 
          lowerKey.includes('secret')) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactSensitiveData(value);
      }
    }
    return redacted;
  }
  
  return data;
}

/**
 * Enhanced getBoardColumns with comprehensive error handling
 */
export async function getBoardColumns(): Promise<MondayColumn[]> {
  try {
    // Check rate limit
    checkRateLimit('monday');
    
    const config = getApiConfig();
    secureLog('info', 'Fetching board columns', { boardId: config.mondayBoardId });
    
    const query = `
      query GetBoardColumns($boardId: ID!) {
        boards(ids: [$boardId]) {
          id
          name
          columns {
            id
            title
            type
            settings_str
          }
        }
      }
    `;

    const data = await withRetry(() => gql(query, { boardId: config.mondayBoardId }));
    
    if (!data.boards || !Array.isArray(data.boards) || data.boards.length === 0) {
      throw new MondayApiError(
        ERROR_CODES.INVALID_BOARD_ID,
        `Board not found or inaccessible: ${config.mondayBoardId}`,
        data
      );
    }

    const board = data.boards[0];
    const columns = board.columns || [];
    
    secureLog('info', 'Successfully fetched board columns', { 
      boardName: board.name,
      columnsCount: columns.length 
    });
    
    return columns;
  } catch (error) {
    secureLog('error', 'Failed to fetch board columns', { error: error.message });
    throw error;
  }
}

/**
 * Enhanced createBoardItem with comprehensive validation and error handling
 */
export async function createBoardItem(
  itemName: string, 
  columnValues: Record<string, any>
): Promise<CreateItemResponse> {
  try {
    // Check rate limit
    checkRateLimit('monday');
    
    const config = getApiConfig();
    
    // Validate and sanitize inputs
    const sanitizedName = sanitizeInput(itemName);
    const sanitizedValues = sanitizeInput(columnValues);
    
    if (!sanitizedName || sanitizedName.length === 0) {
      throw new MondayApiError(
        ERROR_CODES.MISSING_REQUIRED_FIELDS,
        'Item name is required and cannot be empty'
      );
    }

    // Validate email if present
    const emailColumn = Object.entries(sanitizedValues).find(([_, value]) => 
      typeof value === 'object' && value?.email
    );
    
    if (emailColumn && !validateEmail(emailColumn[1].email)) {
      throw new MondayApiError(
        ERROR_CODES.DATA_VALIDATION_ERROR,
        'Invalid email format provided'
      );
    }

    // Validate phone if present
    const phoneColumn = Object.entries(sanitizedValues).find(([_, value]) => 
      typeof value === 'object' && value?.phone
    );
    
    if (phoneColumn && !validatePhone(phoneColumn[1].phone)) {
      throw new MondayApiError(
        ERROR_CODES.DATA_VALIDATION_ERROR,
        'Invalid phone number format provided'
      );
    }

    secureLog('info', 'Creating board item', { 
      itemName: sanitizedName,
      boardId: config.mondayBoardId,
      columnCount: Object.keys(sanitizedValues).length
    });

    const query = `
      mutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
        create_item(
          board_id: $boardId
          item_name: $itemName
          column_values: $columnValues
        ) {
          id
          name
        }
      }
    `;

    const variables = {
      boardId: config.mondayBoardId,
      itemName: sanitizedName,
      columnValues: JSON.stringify(sanitizedValues)
    };

    const data = await withRetry(() => gql(query, variables));
    
    if (!data.create_item || !data.create_item.id) {
      throw new MondayApiError(
        ERROR_CODES.MONDAY_SERVER_ERROR,
        'Failed to create item: Invalid response structure',
        data
      );
    }

    secureLog('info', 'Successfully created board item', { 
      itemId: data.create_item.id,
      itemName: data.create_item.name
    });

    return data;
  } catch (error) {
    secureLog('error', 'Failed to create board item', { 
      error: error.message,
      itemName: sanitizeInput(itemName)
    });
    throw error;
  }
}

/**
 * Health check function for Monday API
 */
export async function mondayHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  details: {
    apiConnection: boolean;
    boardAccess: boolean;
    columnsLoaded: boolean;
    responseTime: number;
  };
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    // Test basic API connection
    const connectionTest = await testMondayConnection();
    const responseTime = Date.now() - startTime;
    
    if (!connectionTest.success) {
      return {
        status: 'unhealthy',
        details: {
          apiConnection: false,
          boardAccess: false,
          columnsLoaded: false,
          responseTime
        },
        error: connectionTest.error
      };
    }

    // Test column loading
    const columns = await getBoardColumns();
    const finalResponseTime = Date.now() - startTime;
    
    const status = finalResponseTime > 5000 ? 'degraded' : 'healthy';
    
    return {
      status,
      details: {
        apiConnection: true,
        boardAccess: true,
        columnsLoaded: columns.length > 0,
        responseTime: finalResponseTime
      }
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const mondayError = error instanceof MondayApiError ? error : parseMondayError(error);
    
    return {
      status: 'unhealthy',
      details: {
        apiConnection: false,
        boardAccess: false,
        columnsLoaded: false,
        responseTime
      },
      error: mondayError.message
    };
  }
}