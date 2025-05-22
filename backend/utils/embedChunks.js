require("dotenv").config(); // Load environment variables from .env file

const axios = require("axios"); // Import axios for making HTTP requests

// Define the URL for the Ollama embedding API, fallback to localhost if not set in environment
const OLLA_API_URL = process.env.OLLA_API_URL || "http://127.0.0.1:11434/api/embeddings";

// Export an async function that takes an array of text chunks and returns their embeddings
module.exports = async function embedChunks(chunks) {
  const embeddings = []; // Initialize an array to store the result

  // Loop through each chunk of text
  for (const chunk of chunks) {
    // Send a POST request to Ollama API to generate embedding for the chunk
    const res = await axios.post(OLLA_API_URL, {
      model: "nomic-embed-text", // Specify embedding model
      prompt: chunk, // Text to be embedded
    });

    // Push the embedding and original chunk text to the result array
    embeddings.push({
      embedding: res.data.embedding, // Store embedding vector
      text: chunk, // Store original chunk for later reference
    });
  }

  // Return array of objects: [{ embedding, text }, ...]
  return embeddings;
};
