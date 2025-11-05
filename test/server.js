import express from "express";
import fetch from "node-fetch";
import cors from "cors";

// const express = require("express");
// const fetch = require("node-fetch");
// const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { messages } = req.body; // <-- Expect full messages array now

  if (!Array.isArray(messages)) {
    res.status(400).json({ error: "Missing or invalid 'messages' array" });
    return;
  }

  // Forward to OpenAI (streaming)
  const upstream = await fetch("http://10.21.67.7:8080/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,      // ✅ Send the whole conversation
      stream: true,  // enable streaming
    }),
  });

  // Set up streaming response to frontend
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Pipe OpenAI stream directly through
  for await (const chunk of upstream.body) {
    res.write(chunk);
  }

  res.end();
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));