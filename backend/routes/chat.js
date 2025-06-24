


// Importing required modules
const express = require("express"); // Web framework
const multer = require("multer");   // For handling file uploads
const axios = require("axios");     // For making HTTP requests
const path = require("path");       // For file path operations

// Importing custom utility functions for parsing and processing files
const parsePDF = require("../utils/parsePDF");       // PDF parser
const parseExcel = require("../utils/parseExcel");   // Excel (.xlsx) parser
const chunkText = require("../utils/chunkText");     // Function to split large text into smaller chunks
const embedChunks = require("../utils/embedChunks"); // Generates embeddings for text chunks
const { findMostRelevant } = require("../utils/vectorUtils"); // Finds most relevant text chunks using vector similarity
const Tesseract = require("tesseract.js");           // OCR library for image-to-text

const router = express.Router();     // Creates a new router instance
const upload = multer();            // Initialize multer to parse multipart/form-data (like file uploads)

// Helper: Parse plain text file buffer to UTF-8 string
const parseTxt = (buffer) => buffer.toString("utf-8").trim();

// Helper: Extract text from image using OCR
const parseImage = async (buffer) => {
  const { data } = await Tesseract.recognize(buffer, "eng"); // Use English language
  return data.text.trim(); // Return trimmed extracted text
};

// Route handler for POST /chat
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // Extract prompt and response format from request body, and file from the uploaded content
    const { prompt, format } = req.body;
    const file = req.file;

    // Validate input
    if (!file || !prompt) {
      return res.status(400).json({ error: "Missing file or prompt." });
    }

    console.log("📁 File received:", file.originalname);
    console.log("❓ Prompt received:", prompt);

    const name = file.originalname.toLowerCase(); // Lowercase the filename
    let text = ""; // Will hold parsed file text

    // File type detection and respective parsing
    if (name.endsWith(".pdf")) {
      text = await parsePDF(file.buffer); // Use PDF parser
    } else if (name.endsWith(".xlsx")) {
      text = parseExcel(file.buffer);     // Use Excel parser
    } else if (name.endsWith(".txt")) {
      text = parseTxt(file.buffer);       // Parse plain text file
    } else if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")) {
      text = await parseImage(file.buffer); // OCR image and extract text
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    // Ensure parsed text is meaningful and long enough
    if (!text || text.trim().length < 30) {
      return res.status(400).json({ error: "Parsed content is too short or empty." });
    }

    // Log a preview of the parsed text
    console.log("📝 Parsed Text Sample:\n", text.slice(0, 500));

    // Break the text into smaller chunks for processing
    const chunks = chunkText(text);
    console.log("🔗 Number of text chunks:", chunks.length);

    // Generate embeddings for each chunk
    const embeddedChunks = await embedChunks(chunks);
    console.log("📌 Embedded chunks:", embeddedChunks.length);

    // Create embedding for the user's prompt using Ollama embedding API
    const promptEmbeddingRes = await axios.post(
      "http://127.0.0.1:11434/api/embeddings",
      { model: "nomic-embed-text", prompt },
      { timeout: 10000 }
    );
    const promptEmbedding = promptEmbeddingRes.data.embedding;

    // Use vector similarity to find top 3 most relevant chunks
    const topChunks = findMostRelevant(promptEmbedding, embeddedChunks, 3);
    const context = topChunks.map(c => c.text).join("\n---\n"); // Join selected context with separators

    // System instruction varies based on requested format
    const systemInstruction = format === "json"
      ? "Respond with only a JSON array of objects based on this context."
      : "Respond in clear and natural language. Do not mention that you are an AI. Do not say 'based on the context'.";

    // Construct the final prompt for LLM
    const fullPrompt = `You are an intelligent assistant. Based only on the context below, answer the user's question clearly.\n\nContext:\n${context}\n\nQuestion:\n${prompt}\n\n${systemInstruction}`.trim();

    // Send prompt to Ollama model (llama3) for chat response
    const chatRes = await axios.post(
      "http://127.0.0.1:11434/api/chat",
      {
        model: "llama3",
        messages: [{ role: "user", content: fullPrompt }],
        stream: false,
      },
      { timeout: 2000000 }
    );

    const message = chatRes?.data?.message?.content;
    console.log("✅ Model response received.");

    // Return model's message
    if (message) {
      res.json({ response: message });
    } else {
      res.status(500).json({ error: "Unexpected response from the model." });
    }
  } catch (error) {
    // Log and return error response
    console.error("❌ Error in /chat route:", error.message || error);
    if (error.response) {
      console.error("🔍 Ollama error response:", error.response.data);
    }
    res.status(500).json({ error: "Internal server error." });
  }
});

// Export router to be used in your main app.js
module.exports = router;
