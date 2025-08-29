const API_KEY = import.meta.env.VITE_MONDAY_API_KEY as string;
const BOARD_ID = import.meta.env.VITE_MONDAY_BOARD_ID as string;
const MONDAY_API_URL = "https://api.monday.com/v2";
async function gql(query: string, variables: Record < string, any > = {}) {
    const res = await fetch(MONDAY_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": API_KEY,
        },
        body: JSON.stringify({
            query,
            variables
        }),
    });
    const data = await res.json();
    if (data.errors) {
        console.error("GraphQL Errors:", data.errors);
        throw new Error(Monday API error: $ {
            data.errors[0].message
        });
    }
    return data.data;
}
export async function getBoardColumns() {
        const query = query($boardId: [ID!] !) {
            boards(ids: $boardId) {
                columns {
                    id title type settings_str
                }
            }
        };