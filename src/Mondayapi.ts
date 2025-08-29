// src/Mondayapi.ts
import axios from "axios";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY = import.meta.env.VITE_MONDAY_API_KEY;

const client = axios.create({
  baseURL: MONDAY_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: MONDAY_API_KEY,
  },
});

export async function getBoardColumns(boardId: string) {
  const query = `
    query {
      boards(ids: ${boardId}) {
        columns {
          id
          title
          type
        }
      }
    }
  `;
  const response = await client.post("", { query });
  return response.data.data.boards[0].columns;
}

export async function createItem(boardId: string, itemName: string, columnValues: any) {
  const mutation = `
    mutation ($boardId: Int!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }
  `;
  const variables = {
    boardId: parseInt(boardId, 10),
    itemName,
    columnValues: JSON.stringify(columnValues),
  };

  const response = await client.post("", { query: mutation, variables });
  return response.data.data.create_item;
}
