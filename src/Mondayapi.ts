// mondayApi.ts
export type MondayColumn = {
  id: string;
  title: string;
  type: string;
  settings_str?: string | null;
};

const API_URL = "https://api.monday.com/v2";
// Vite uses the VITE_ prefix for client env vars
const API_KEY = import.meta.env.VITE_MONDAY_API_KEY as string;
const BOARD_ID = Number(import.meta.env.VITE_MONDAY_BOARD_ID);

if (!API_KEY || !BOARD_ID) {
  console.warn("Missing VITE_MONDAY_API_KEY or VITE_MONDAY_BOARD_ID");
}

async function gql(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error("Monday API error:", json.errors);
    throw new Error("Monday API error");
  }
  return json.data;
}

// Get board columns (with settings to read select options)
export async function getBoardColumns(): Promise<MondayColumn[]> {
  const query = `
    query ($boardId: [Int!]) {
      boards(ids: $boardId) {
        columns { id title type settings_str }
      }
    }
  `;
  const data = await gql(query, { boardId: BOARD_ID });
  return data?.boards?.[0]?.columns ?? [];
}

// Create a new item (lead) in the board
export async function createBoardItem(itemName: string, columnValues: Record<string, any>) {
  const query = `
    mutation ($boardId: Int!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) { id }
    }
  `;
  return gql(query, {
    boardId: BOARD_ID,
    itemName,
    columnValues: JSON.stringify(columnValues),
  });
}
