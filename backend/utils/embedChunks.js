

// require("dotenv").config();
// const axios = require("axios");
// const { normalizeVector } = require("./vectorUtils");

// const OLLA_API_URL = process.env.OLLA_API_URL || "http://127.0.0.1:11434/api/embeddings";

// module.exports = async function embedChunks(chunks) {
//   const embeddings = [];

//   for (const chunk of chunks) {
//     try {
//       const res = await axios.post(OLLA_API_URL, {
//         model: "nomic-embed-text",
//         prompt: chunk,
//       });

//       const rawVec = res.data.embedding;
//       const normVec = normalizeVector(rawVec);

//       embeddings.push({
//         embedding: normVec,
//         text: chunk,
//       });
//     } catch (err) {
//       console.error("❌ Embedding failed for chunk:", chunk.slice(0, 50), "...", err.message);
//     }
//   }

//   return embeddings;
// };

// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import the axios HTTP client to make HTTP requests
const axios = require("axios");

// Import a utility function to normalize vectors (unit length, etc.)
const { normalizeVector } = require("./vectorUtils");

// Set the embedding API URL from environment variable or use localhost as fallback
const OLLA_API_URL = process.env.OLLA_API_URL || "http://127.0.0.1:11434/api/embeddings";

/**
 * Async function to generate embeddings for an array of text chunks.
 * Each chunk is sent to the Ollama embedding API, the resulting vector is normalized,
 * and the result is stored with the original text.
 *
 * @param {string[]} chunks - Array of text chunks to be embedded.
 * @returns {Promise<Array<{embedding: number[], text: string}>>} - Array of embedding objects.
 */
module.exports = async function embedChunks(chunks) {
  // Initialize an array to store the final embeddings
  const embeddings = [];

  // Iterate over each text chunk
  for (const chunk of chunks) {
    try {
      // Send a POST request to the embedding API with the chunk and model name
      const res = await axios.post(OLLA_API_URL, {
        model: "nomic-embed-text", // Model name for embedding
        prompt: chunk,             // Text input to embed
      });

      // Extract the raw embedding vector from the API response
      const rawVec = res.data.embedding;

      // Normalize the vector (e.g., convert to unit vector) for consistent similarity calculations
      const normVec = normalizeVector(rawVec);

      // Push the normalized vector along with the original chunk to the result array
      embeddings.push({
        embedding: normVec,
        text: chunk,
      });
    } catch (err) {
      // Log a message if embedding fails for a particular chunk
      console.error("❌ Embedding failed for chunk:", chunk.slice(0, 50), "...", err.message);
    }
  }

  // Return the array of successfully embedded chunks
  return embeddings;
};
