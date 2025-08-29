const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY = "<YOUR_API_KEY>"; // replace with your actual key

async function mondayRequest(query: string, variables?: Record<string, any>) {
  const res = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: MONDAY_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();
  if (data.errors) {
    console.error("Monday API error:", data.errors);
    throw new Error(data.errors[0].message);
  }
  return data.data;
}

// ✅ Get board columns
export async function getBoardColumns(boardId: number) {
  const query = `
    query ($boardId: [Int]) {
      boards(ids: $boardId) {
        columns {
          id
          title
          type
        }
      }
    }
  `;
  const data = await mondayRequest(query, { boardId });
  return data.boards[0].columns;
}

// ✅ Create item
export async function createItem(boardId: number, groupId: string, itemName: string, columnValues: Record<string, any>) {
  const query = `
    mutation ($boardId: Int!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }
  `;
  const variables = {
    boardId,
    groupId,
    itemName,
    columnValues: JSON.stringify(columnValues),
  };
  const data = await mondayRequest(query, variables);
  return data.create_item;
}