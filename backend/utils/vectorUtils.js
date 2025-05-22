// Function to compute cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  // Calculate dot product of vecA and vecB
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);

  // Calculate magnitude (norm) of vecA
  const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));

  // Calculate magnitude (norm) of vecB
  const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  // Return cosine similarity: dot product divided by product of magnitudes
  return dot / (normA * normB);
}

// Function to find the top N most relevant chunks based on cosine similarity
function findMostRelevant(promptEmbedding, embeddedChunks, topN = 3) {
  return embeddedChunks
    .map(chunk => ({
      ...chunk, // Spread the existing chunk properties
      score: cosineSimilarity(promptEmbedding, chunk.embedding) // Add similarity score
    }))
    .sort((a, b) => b.score - a.score) // Sort in descending order of score (most relevant first)
    .slice(0, topN); // Return only the top N chunks
}

// Export the functions to be used in other modules
module.exports = { cosineSimilarity, findMostRelevant };
