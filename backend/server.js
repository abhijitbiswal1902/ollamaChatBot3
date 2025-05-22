
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
require('dotenv').config();

const app = express();

// Allow frontend origin from environment or default to localhost:3000
const allowedOrigin = "http://localhost:3000";

// Optional logging
if (process.env.REACT_APP_LOGGING === "true") {
  console.log("Using Ollama API:", process.env.OLLA_API_URL);
  console.log("Allowing frontend origin:", allowedOrigin);
}

// Middleware
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/chat", chatRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 1902;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
