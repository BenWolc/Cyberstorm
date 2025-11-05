const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Stream OpenAI-style responses through to the browser
app.post("/api/generate", async (req, res) => {
  const { messages } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const upstream = await fetch("http://10.21.67.7:8080/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      stream: true,
    }),
  });

  // Pipe chunks directly
  for await (const chunk of upstream.body) {
    res.write(chunk);
  }

  res.end();
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));