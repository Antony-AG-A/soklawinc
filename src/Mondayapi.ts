const BOARD_ID = import.meta.env.VITE_MONDAY_BOARD_ID as string;

// Point to your proxy, not Monday directly
const MONDAY_PROXY_URL = "http://localhost:4000/monday";

async function gql(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(MONDAY_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const data = await gql(query, { boardId: BOARD_ID });
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
    boardId: BOARD_ID,
    itemName,
    columnValues: JSON.stringify(columnValues),
  };

  const data = await gql(query, variables);
  return data.create_item;
}
