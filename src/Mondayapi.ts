const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY = import.meta.env.VITE_MONDAY_API_KEY as string;

async function gql(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(MONDAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": MONDAY_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();

  if (data.errors) {
    console.error("GraphQL Errors:", data.errors);
    throw new Error(`Monday API error: ${data.errors[0].message}`);
  }

  return data.data;
}

export async function getBoardColumns() {
  const query = `
    query ($boardId: [ID!]!) {
      boards (ids: $boardId) {
        columns {
          id
          title
          type
          settings_str
        }
      }
    }
  `;

  const data = await gql(query, { boardId: import.meta.env.VITE_MONDAY_BOARD_ID });
  return data.boards[0].columns;
}

export async function createBoardItem(itemName: string, columnValues: Record<string, any>) {
  const query = `
    mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
      create_item (board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }
  `;

  const variables = {
    boardId: import.meta.env.VITE_MONDAY_BOARD_ID,
    itemName,
    columnValues: JSON.stringify(columnValues),
  };

  const data = await gql(query, variables);
  return data.create_item;
}
