const BOARD_ID = import.meta.env.VITE_MONDAY_BOARD_ID as string;
const MONDAY_PROXY_URL = "http://localhost:4000/monday";

async function gql(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(MONDAY_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();

  if (data.errors) {
    console.error("GraphQL Errors:", data.errors);
    throw new Error(`Monday API error: ${data.errors[0].message}`);
  }

  return data.data;
}
