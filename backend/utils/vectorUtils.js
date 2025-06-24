// Compute dot product of two vectors
function dotProduct(vecA, vecB) {
  return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
}

// Compute L2 norm (magnitude) of a vector
function vectorNorm(vec) {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

// Compute cosine similarity with safety check
function cosineSimilarity(vecA, vecB) {
  const normA = vectorNorm(vecA);
  const normB = vectorNorm(vecB);

  if (normA === 0 || normB === 0) return 0;

  return dotProduct(vecA, vecB) / (normA * normB);
}

// Normalize a vector
function normalizeVector(vec) {
  const norm = vectorNorm(vec);
  return norm === 0 ? vec : vec.map(val => val / norm);
}

// Retrieve top N most relevant chunks
function findMostRelevant(promptEmbedding, embeddedChunks, topN = 3) {
  return embeddedChunks
    .filter(c => Array.isArray(c.embedding) && c.embedding.length > 0)
    .map(chunk => ({
      ...chunk,
      score: cosineSimilarity(promptEmbedding, chunk.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

module.exports = {
  cosineSimilarity,
  normalizeVector,
  findMostRelevant
};
