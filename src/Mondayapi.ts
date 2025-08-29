/**
 * Enhanced Monday.com API integration with comprehensive error handling and security
 */

import { getApiConfig, getMondayHeaders } from './utils/apiConfig';
import { parseMondayError, logError, withRetry, MondayApiError, ERROR_CODES } from './utils/errorHandler';

export interface MondayColumn {
  id: string;
  title: string;
  type: string;
  settings_str?: string;
}

export interface CreateItemResponse {
  create_item?: {
    id: string;
    name: string;
  };
}

/**
 * Enhanced GraphQL query executor with comprehensive error handling
 */
async function gql(query: string, variables: Record<string, any> = {}): Promise<any> {
  const config = getApiConfig();
  const endpoint = config.proxyUrl;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        query: query.trim(), 
        variables 
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: Expected JSON');
    }

    const data = await response.json();

    // Handle GraphQL errors
    if (data.errors && Array.isArray(data.errors)) {
      const error = parseMondayError(data, endpoint);
      logError(error);
      throw error;
    }

    // Validate response structure
    if (!data.data) {
      throw new MondayApiError(
        ERROR_CODES.MONDAY_SERVER_ERROR,
        'Invalid response structure from Monday API',
        data,
        endpoint
      );
    }

    return data.data;
  } catch (error) {
    // Parse and log the error
    const mondayError = error instanceof MondayApiError ? error : parseMondayError(error, endpoint);
    logError(mondayError);
    throw mondayError;
  }
}

/**
 * Get board columns with enhanced error handling
 */
export async function getBoardColumns(): Promise<MondayColumn[]> {
  const config = getApiConfig();
  
  const query = `
    query GetBoardColumns($boardId: ID!) {
      boards(ids: [$boardId]) {
        columns {
          id
          title
          type
          settings_str
        }
      }
    }
  `;

  try {
    const data = await withRetry(() => gql(query, { boardId: config.mondayBoardId }));
    
    if (!data.boards || !Array.isArray(data.boards) || data.boards.length === 0) {
      throw new MondayApiError(
        ERROR_CODES.INVALID_BOARD_ID,
        `Board not found: ${config.mondayBoardId}`,
        data
      );
    }

    const columns = data.boards[0].columns;
    
    if (!Array.isArray(columns)) {
      throw new MondayApiError(
        ERROR_CODES.DATA_VALIDATION_ERROR,
        'Invalid columns data structure',
        data
      );
    }

    return columns;
  } catch (error) {
    if (error instanceof MondayApiError) {
      throw error;
    }
    throw parseMondayError(error, 'getBoardColumns');
  }
}

/**
 * Create board item with enhanced validation and error handling
 */
export async function createBoardItem(
  itemName: string, 
  columnValues: Record<string, any>
): Promise<CreateItemResponse> {
  const config = getApiConfig();
  
  // Validate input parameters
  if (!itemName || typeof itemName !== 'string' || itemName.trim().length === 0) {
    throw new MondayApiError(
      ERROR_CODES.MISSING_REQUIRED_FIELDS,
      'Item name is required and cannot be empty'
    );
  }

  if (!columnValues || typeof columnValues !== 'object') {
    throw new MondayApiError(
      ERROR_CODES.DATA_VALIDATION_ERROR,
      'Column values must be provided as an object'
    );
  }

  // Sanitize item name
  const sanitizedName = itemName.trim().substring(0, 255); // Monday has a 255 char limit

  // Validate and sanitize column values
  const sanitizedColumnValues: Record<string, any> = {};
  
  for (const [columnId, value] of Object.entries(columnValues)) {
    if (value !== null && value !== undefined && value !== '') {
      // Validate column ID format
      if (!/^[a-zA-Z0-9_]+$/.test(columnId)) {
        console.warn(`Skipping invalid column ID: ${columnId}`);
        continue;
      }
      
      sanitizedColumnValues[columnId] = value;
    }
  }

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
    columnValues: JSON.stringify(sanitizedColumnValues)
  };

  try {
    const data = await withRetry(() => gql(query, variables));
    
    if (!data.create_item || !data.create_item.id) {
      throw new MondayApiError(
        ERROR_CODES.MONDAY_SERVER_ERROR,
        'Failed to create item: Invalid response from Monday API',
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof MondayApiError) {
      throw error;
    }
    throw parseMondayError(error, 'createBoardItem');
  }
}

/**
 * Test Monday API connection and configuration
 */
export async function testMondayConnection(): Promise<{
  success: boolean;
  boardId?: string;
  boardName?: string;
  columnsCount?: number;
  error?: string;
}> {
  try {
    const config = getApiConfig();
    
    const query = `
      query TestConnection($boardId: ID!) {
        boards(ids: [$boardId]) {
          id
          name
          columns {
            id
            title
            type
          }
        }
      }
    `;

    const data = await gql(query, { boardId: config.mondayBoardId });
    
    if (!data.boards || data.boards.length === 0) {
      return {
        success: false,
        error: `Board not found: ${config.mondayBoardId}`
      };
    }

    const board = data.boards[0];
    
    return {
      success: true,
      boardId: board.id,
      boardName: board.name,
      columnsCount: board.columns?.length || 0
    };
  } catch (error) {
    const mondayError = error instanceof MondayApiError ? error : parseMondayError(error);
    return {
      success: false,
      error: mondayError.message
    };
  }
}

/**
 * Get board items for testing and debugging
 */
export async function getBoardItems(limit: number = 10): Promise<any[]> {
  const config = getApiConfig();
  
  const query = `
    query GetBoardItems($boardId: ID!, $limit: Int!) {
      boards(ids: [$boardId]) {
        items_page(limit: $limit) {
          items {
            id
            name
            created_at
            column_values {
              id
              text
              value
            }
          }
        }
      }
    }
  `;

  try {
    const data = await withRetry(() => gql(query, { 
      boardId: config.mondayBoardId, 
      limit 
    }));
    
    if (!data.boards || !data.boards[0] || !data.boards[0].items_page) {
      return [];
    }

    return data.boards[0].items_page.items || [];
  } catch (error) {
    const mondayError = error instanceof MondayApiError ? error : parseMondayError(error);
    logError(mondayError);
    throw mondayError;
  }
}</parameter>