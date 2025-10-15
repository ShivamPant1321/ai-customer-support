/**
 * Calculate dot product of two vectors
 */
function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Calculate magnitude (length) of a vector
 */
function magnitude(a) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * a[i];
  }
  return Math.sqrt(sum);
}

/**
 * Calculate cosine similarity between two vectors
 * Returns a value between -1 and 1, where 1 means identical direction
 */
export function cosineSimilarity(a, b) {
  const magA = magnitude(a);
  const magB = magnitude(b);
  
  if (magA === 0 || magB === 0) return 0;
  
  return dot(a, b) / (magA * magB);
}

/**
 * Find top K most similar items to a query vector
 */
export function topKMatches(queryVec, items, k = 5) {
  const scored = items.map(item => ({
    id: item.id,
    score: cosineSimilarity(queryVec, item.embedding),
    item: item
  }));
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  return scored.slice(0, k);
}
