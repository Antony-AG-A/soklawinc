/**
 * Secure API configuration management
 */

interface ApiConfig {
  mondayApiUrl: string;
  mondayBoardId: string;
  ghostApiUrl: string;
  ghostApiKey: string;
  proxyUrl: string;
}

/**
 * Validate environment variables and provide fallbacks
 */
function validateEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] || fallback;
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}

/**
 * Get API configuration with validation
 */
export function getApiConfig(): ApiConfig {
  try {
    return {
      mondayApiUrl: 'https://api.monday.com/v2',
      mondayBoardId: validateEnvVar('VITE_MONDAY_BOARD_ID'),
      ghostApiUrl: validateEnvVar('VITE_GHOST_API_URL', 'https://xelf.ghost.io/ghost/api/v3/content/posts/'),
      ghostApiKey: validateEnvVar('VITE_GHOST_API_KEY', '367cdb8a8abe78fe688f751c76'),
      proxyUrl: validateEnvVar('VITE_PROXY_URL', 'http://localhost:4000/monday')
    };
  } catch (error) {
    console.error('API Configuration Error:', error);
    throw error;
  }
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string, type: 'monday' | 'ghost'): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  switch (type) {
    case 'monday':
      // Monday API keys are typically long alphanumeric strings
      return apiKey.length >= 32 && /^[a-zA-Z0-9]+$/.test(apiKey);
    
    case 'ghost':
      // Ghost API keys are typically 26 characters long
      return apiKey.length >= 20 && /^[a-zA-Z0-9]+$/.test(apiKey);
    
    default:
      return false;
  }
}

/**
 * Check if API configuration is valid
 */
export function isApiConfigValid(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const config = getApiConfig();
    
    // Validate Monday API key
    if (!validateApiKey(import.meta.env.VITE_MONDAY_API_KEY || '', 'monday')) {
      errors.push('Invalid Monday.com API key format');
    }
    
    // Validate Ghost API key
    if (!validateApiKey(config.ghostApiKey, 'ghost')) {
      errors.push('Invalid Ghost API key format');
    }
    
    // Validate Board ID
    if (!config.mondayBoardId || !/^\d+$/.test(config.mondayBoardId)) {
      errors.push('Invalid Monday.com Board ID format');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    errors.push(`Configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { valid: false, errors };
  }
}

/**
 * Get headers for Monday API requests
 */
export function getMondayHeaders(): Record<string, string> {
  const apiKey = import.meta.env.VITE_MONDAY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Monday API key not configured');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': apiKey,
    'API-Version': '2023-10'
  };
}

/**
 * Get headers for Ghost API requests
 */
export function getGhostHeaders(): Record<string, string> {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}