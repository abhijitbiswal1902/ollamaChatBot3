// Import required modules
const express = require("express");
const multer = require("multer"); // For handling file uploads
const parsePDF = require("../utils/parsePDF"); // Utility to extract text from PDFs
const parseExcel = require("../utils/parseExcel"); // Utility to extract text from Excel files
const chunkText = require("../utils/chunkText"); // Utility to split long text into smaller chunks
const embedChunks = require("../utils/embedChunks"); // Utility to embed each chunk into a vector
const { findMostRelevant } = require("../utils/vectorUtils"); // Utility to compare embeddings and get top matches
const axios = require("axios"); // HTTP client for API requests

// Create Express router
const router = express.Router();

// Configure multer for handling multipart form data (file upload)
const upload = multer();

// Define POST route for processing file and prompt
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // Extract prompt and uploaded file from the request
    const { prompt } = req.body;
    const file = req.file;

    // Check if both file and prompt are provided
    if (!file || !prompt) {
      return res.status(400).json({ error: "Missing file or prompt" });
    }

    // Log file and prompt info
    console.log("📁 File received:", file.originalname);
    console.log("❓ Prompt received:", prompt);

    // Step 1: Parse file content into plain text
    let text = "";
    if (file.originalname.endsWith(".pdf")) {
      text = await parsePDF(file.buffer); // Parse PDF buffer
    } else if (file.originalname.endsWith(".xlsx")) {
      text = parseExcel(file.buffer); // Parse Excel buffer
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    console.log("Parsed text length:", text.length);

    // Step 2: Break parsed text into smaller, manageable chunks
    const chunks = chunkText(text);
    console.log("🔗 Number of chunks:", chunks.length);

    // Step 3: Embed all chunks into vector representations
    const embeddedChunks = await embedChunks(chunks);
    console.log("📌 Embedded chunks:", embeddedChunks.length);

    // Step 4: Embed the user prompt
    const promptEmbeddingRes = await axios.post(
      "http://127.0.0.1:11434/api/embeddings", // Local embedding API
      {
        model: "nomic-embed-text", // Embedding model
        prompt, // Text to embed
      },
      { timeout: 10000 } // 10-second timeout
    );
    const promptEmbedding = promptEmbeddingRes.data.embedding; // Extract the embedding vector

    // Step 5: Find the top 3 most relevant chunks compared to the prompt
    const topChunks = findMostRelevant(promptEmbedding, embeddedChunks, 3);

    // Merge top chunks into a single string with separators
    const context = topChunks.map((c) => c.text).join("\n---\n");

    console.log("📚 Top chunks selected for context.");

    // Step 6: Prepare a final prompt for the model using the context and user question
    const fullPrompt = `Answer based only on this context:\n${context}\n\nQuestion: ${prompt}`;

    // Step 7: Send the full prompt to the LLaMA 3 model via Ollama API
    const chatRes = await axios.post(
      "http://127.0.0.1:11434/api/chat",
      {
        model: "llama3", // Model name
        messages: [{ role: "user", content: fullPrompt }], // Prompt as chat message
        stream: false, // Disable streaming
      },
      { timeout: 2000000 } // 200-second timeout
    );

    // Log full response from model
    console.log("Full model response:", JSON.stringify(chatRes.data, null, 2));

    // Extract the actual response message content from the API response
    const message = chatRes?.data?.message?.content;

    console.log("Extracted message content:", message);

    // If message is present, return it to the client
    if (message) {
      console.log("✅ Model response received.");
      res.json({ response: message });
    } else {
      // Handle unexpected model response
      console.error("❌ Unexpected response format from model:", chatRes.data);
      res.status(500).json({ error: "Unexpected response from model" });
    }
  } catch (error) {
    // General error handler
    console.error("❌ Error in /chat route:", error.message || error);

    // Log additional error response info if available
    if (error.response) {
      console.error("🔍 Error response from Ollama:", error.response.data);
    }

    // Return 500 server error to client
    res.status(500).json({ error: "Server error" });
  }
});

// Export the router to be used in main server
module.exports = router;
