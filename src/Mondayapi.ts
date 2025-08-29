import axios from "axios";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY = import.meta.env.VITE_MONDAY_API_KEY;

export const getBoardColumns = async (boardId: string) => {
  try {
    const query = `
      query ($boardId: [Int]) {
        boards (ids: $boardId) {
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

    const variables = { boardId: parseInt(boardId) };

    const response = await axios.post(
      MONDAY_API_URL,
      { query, variables },
      {
        headers: {
          Authorization: MONDAY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // 👀 Debugging: log the full response
    console.log("Raw Monday response:", response.data);

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data?.boards?.[0]?.columns || [];
  } catch (error) {
    console.error("Error fetching columns:", error);
    throw error;
  }
};
