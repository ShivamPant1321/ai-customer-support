import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Updated to use Gemini 2.0 Flash (Gemini 2.5)
export const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// A small, flexible embedding helper. Uses global fetch (Node 18+). Configure via env vars.
// For Gemini (Google): set GOOGLE_API_KEY or GEMINI_API_KEY and optionally GEMINI_API_URL/GEMINI_MODEL.
// For OpenAI fallback: set OPENAI_API_KEY and optionally OPENAI_EMBEDDING_MODEL.
export async function getEmbedding(text) {
	// Basic validation
	if (typeof text !== 'string' || text.length === 0) {
		throw new Error('getEmbedding requires a non-empty text string');
	}

	// Prefer explicit provider selection
	const provider = (process.env.GEMINI_PROVIDER || process.env.EMBEDDING_PROVIDER || '').toLowerCase();

	// Helper to try to parse embeddings from multiple common shapes
	function extractEmbedding(json) {
		if (!json) return null;
		if (Array.isArray(json) && json.length && typeof json[0] === 'number') return json;
		if (Array.isArray(json?.data) && json.data[0]?.embedding) return json.data[0].embedding;
		if (Array.isArray(json?.data) && Array.isArray(json.data[0]?.values)) return json.data[0].values;
		if (Array.isArray(json?.embedding)) return json.embedding;
		if (Array.isArray(json?.values)) return json.values;
		// Some providers wrap results differently
		if (Array.isArray(json?.embeddings) && Array.isArray(json.embeddings[0])) return json.embeddings[0];
		// OpenAI shape
		if (Array.isArray(json?.data) && json.data[0]?.embedding) return json.data[0].embedding;
		return null;
	}

	// If user chose OpenAI or OPENAI_API_KEY exists, use OpenAI embeddings endpoint
	const openaiKey = process.env.OPENAI_API_KEY;
	if (provider === 'openai' || (!provider && openaiKey)) {
		if (!openaiKey) throw new Error('OPENAI_API_KEY is required for OpenAI provider');
		const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
		const res = await fetch('https://api.openai.com/v1/embeddings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${openaiKey}`
			},
			body: JSON.stringify({ model, input: text })
		});
		const json = await res.json();
		if (!res.ok) {
			const errMsg = json?.error?.message || JSON.stringify(json);
			throw new Error(`OpenAI embedding request failed: ${errMsg}`);
		}
		const emb = extractEmbedding(json) || (json?.data && json.data[0]?.embedding) || null;
		return emb ?? json;
	}

	// Otherwise attempt a generic Google/Gemini call
	const googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
	if (!googleKey) {
		throw new Error('No embedding provider configured. Set GOOGLE_API_KEY (for Gemini) or OPENAI_API_KEY.');
	}
	// Default URL is a template — replace GEMINI_MODEL with the correct model for Gemini 2.5 if needed.
	const defaultModel = process.env.GEMINI_MODEL || 'textembedding-gecko-001';
	const url = process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/v1beta2/models/${defaultModel}:embed`;

	const resp = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${googleKey}`
		},
		body: JSON.stringify({ input: text })
	});

	const json = await resp.json();
	if (!resp.ok) {
		const errMsg = json?.error?.message || JSON.stringify(json);
		throw new Error(`Gemini/Google embedding request failed: ${errMsg}`);
	}

	// Try to extract embedding from common shapes; return the raw json if not found so caller can inspect it
	const embedding = extractEmbedding(json);
	return embedding ?? json;
}

/**
 * Generate chat response using Gemini
 */
export async function generateChatResponse(prompt, options = {}) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: options.model || 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 700,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

/**
 * Generate embeddings in batch
 */
async function getBatchEmbeddings(texts) {
  const embeddings = [];
  for (const text of texts) {
    const embedding = await getEmbedding(text);
    embeddings.push(embedding);
  }
  return embeddings;
}

export default {
  getEmbedding,
  generateChatResponse,
  getBatchEmbeddings,
  genAI
};
