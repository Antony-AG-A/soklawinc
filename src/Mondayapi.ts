import axios from "axios";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY = import.meta.env.VITE_MONDAY_API_KEY as string;

/**
 * Get all columns of a board
 */
export const getBoardColumns = async (boardId: number) => {
  const query = `
    query {
      boards (ids: ${boardId}) {
        columns {
          id
          title
          type
        }
      }
    }
  `;

  const response = await axios.post(
    MONDAY_API_URL,
    { query },
    {
      headers: {
        Authorization: MONDAY_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.boards[0].columns;
};

/**
 * Create a new item in the board
 */
export const createBoardItem = async (
  boardId: number,
  groupId: string,
  itemName: string,
  columnValues: Record<string, any>
) => {
  const query = `
    mutation {
      create_item(
        board_id: ${boardId},
        group_id: "${groupId}",
        item_name: "${itemName}",
        column_values: ${JSON.stringify(JSON.stringify(columnValues))}
      ) {
        id
      }
    }
  `;

  const response = await axios.post(
    MONDAY_API_URL,
    { query },
    {
      headers: {
        Authorization: MONDAY_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.create_item;
};

// ✅ Export alias so `createItem` still works
export { createBoardItem as createItem };
