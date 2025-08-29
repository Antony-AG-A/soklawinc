import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // loads .env.local

const app = express();
app.use(express.json());

app.post("/monday", async (req, res) => {
  const { query, variables } = req.body;

  try {
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.VITE_MONDAY_API_KEY,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

app.listen(4000, () => console.log("✅ Proxy running at http://localhost:4000"));
