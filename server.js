import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 5002; // Changed from 5001 to 5002

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY is not set in environment variables');
  console.error('Please create a .env file with GEMINI_API_KEY');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Professional response formatting with enhanced structure
function formatAIResponse(text) {
  let formatted = text.trim();
  
  // Remove excessive markdown and clean up
  formatted = formatted
    .replace(/\*\*\*+/g, '**') // Normalize excessive bold formatting
    .replace(/^\s*[\-\*]\s+/gm, '• ') // Standardize bullet points
    .replace(/\n{3,}/g, '\n\n') // Limit excessive line breaks
    .replace(/^(Step \d+:?|Steps?:?|Here's how:?|To do this:?)/gmi, '## $1') // Convert steps to headers
    .replace(/^(\d+\.\s+)(.+)$/gm, '$1**$2**') // Bold numbered items
    .replace(/^(Important|Note|Warning|Tip):/gmi, '**$1:**') // Emphasize important labels
    .replace(/^(Benefits?|Features?|Options?):?$/gmi, '## $1') // Convert common headers
    .replace(/([.!?])\s*\n\s*([A-Z])/g, '$1\n\n$2'); // Better paragraph spacing

  // Enhance structured content
  formatted = formatted.replace(/^• (.+)$/gm, (match, content) => {
    return `• **${content.split(':')[0]}**${content.includes(':') ? ':' + content.split(':').slice(1).join(':') : ''}`;
  });

  return formatted;
}

// Enhanced system prompt for professional responses
const getSystemPrompt = () => `You are a professional AI customer support assistant. Your responses should be:

**Response Quality:**
- Clear, concise, and actionable (max 200 words)
- Well-structured with proper formatting
- Professional yet friendly tone
- Include specific steps when applicable

**Formatting Guidelines:**
- Use bullet points (•) for lists
- Number steps (1., 2., 3.) for processes
- Use **bold** for important terms
- Add ## headers for main sections
- Keep paragraphs short and scannable

**Content Focus:**
- Prioritize accuracy and helpfulness
- Provide specific, actionable information
- When uncertain, clearly state limitations
- Escalate complex technical issues appropriately

Always maintain professionalism while being approachable and helpful.`;

// Enhanced rate limiting middleware
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

const rateLimit = (req, res, next) => {
  const clientIP = req.ip;
  const now = Date.now();
  
  // Clean up old entries
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.windowStart > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
  
  // Check current client
  const clientData = rateLimitMap.get(clientIP) || { count: 0, windowStart: now };
  
  if (now - clientData.windowStart > RATE_LIMIT_WINDOW) {
    clientData.count = 1;
    clientData.windowStart = now;
  } else {
    clientData.count++;
  }
  
  rateLimitMap.set(clientIP, clientData);
  
  if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please wait a moment before trying again.',
      retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - clientData.windowStart)) / 1000)
    });
  }
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS,
    'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT_MAX_REQUESTS - clientData.count),
    'X-RateLimit-Reset': new Date(clientData.windowStart + RATE_LIMIT_WINDOW).toISOString()
  });
  
  next();
};

// Apply rate limiting to chat endpoint
app.use('/api/chat', rateLimit);

// Enhanced chat endpoint with professional error handling
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { message, sessionId, metadata } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: 'Message too long',
        code: 'MESSAGE_TOO_LONG',
        maxLength: 2000
      });
    }

    // Enhanced model configuration
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topP: 0.8,
        topK: 40,
      }
    });
    
    // Build enhanced prompt with system context
    const systemPrompt = getSystemPrompt();
    const enhancedPrompt = `${systemPrompt}

**User Message:** ${message}

**Context:** ${sessionId ? `Session ID: ${sessionId}` : 'New conversation'}

Please provide a helpful, well-structured response:`;

    console.log(`[${new Date().toISOString()}] Processing message: "${message.substring(0, 50)}..."`);

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const rawText = response.text();
    
    // Format and enhance the response
    const formattedResponse = formatAIResponse(rawText);
    
    // Calculate confidence based on response quality
    const confidence = calculateConfidence(formattedResponse, message);
    
    // Response timing
    const responseTime = Date.now() - startTime;
    
    console.log(`[${new Date().toISOString()}] Response generated in ${responseTime}ms (confidence: ${confidence})`);

    res.json({ 
      response: formattedResponse,
      reply: formattedResponse, // Backward compatibility
      confidence: confidence,
      responseTime: responseTime,
      timestamp: new Date().toISOString(),
      status: 'success',
      formatted: true,
      sessionId: sessionId || `session_${Date.now()}`,
      metadata: {
        model: 'gemini-2.0-flash-exp',
        tokens: rawText.length,
        processingTime: responseTime
      }
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] Error processing request:`, error);
    
    // Determine error type and provide appropriate response
    let errorResponse = {
      error: 'Failed to generate response',
      code: 'GENERATION_ERROR',
      timestamp: new Date().toISOString(),
      responseTime: responseTime
    };

    if (error.message?.includes('API key')) {
      errorResponse = {
        ...errorResponse,
        code: 'INVALID_API_KEY',
        message: 'API key configuration issue. Please contact support.'
      };
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorResponse = {
        ...errorResponse,
        code: 'QUOTA_EXCEEDED',
        message: 'Service temporarily unavailable due to high demand. Please try again in a few moments.'
      };
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorResponse = {
        ...errorResponse,
        code: 'NETWORK_ERROR',
        message: 'Network connectivity issue. Please check your connection and try again.'
      };
    }

    // Professional fallback response
    const fallbackResponse = error.message?.includes('quota') 
      ? '## ⚠️ Service Temporarily Busy\n\nI\'m experiencing high demand right now. Please try again in a few moments.\n\n• **Alternative:** Contact our support team directly\n• **Email:** support@company.com\n• **Phone:** 1-800-SUPPORT'
      : '## ❌ Technical Difficulty\n\nI\'m experiencing a temporary technical issue and cannot process your request right now.\n\n• **Please try again** in a few moments\n• **If the issue persists**, contact our support team\n• **For urgent matters**, call 1-800-SUPPORT';

    res.status(error.message?.includes('quota') ? 503 : 500).json({
      ...errorResponse,
      response: fallbackResponse,
      reply: fallbackResponse
    });
  }
});

// Enhanced confidence calculation
function calculateConfidence(response, userMessage) {
  let confidence = 0.7; // Base confidence
  
  // Increase confidence for structured responses
  if (response.includes('•') || response.includes('##')) confidence += 0.1;
  if (response.match(/\d+\./)) confidence += 0.1; // Numbered steps
  if (response.includes('**')) confidence += 0.05; // Bold formatting
  
  // Decrease confidence for vague responses
  if (response.includes('I\'m not sure') || response.includes('I don\'t know')) confidence -= 0.2;
  if (response.length < 50) confidence -= 0.1; // Very short responses
  if (response.includes('contact support') && !userMessage.includes('contact')) confidence -= 0.1;
  
  // Response quality indicators
  if (response.length > 100 && response.length < 500) confidence += 0.1; // Good length
  if (response.split('\n').length > 2) confidence += 0.05; // Multi-paragraph
  
  return Math.max(0.1, Math.min(0.95, confidence)); // Clamp between 0.1 and 0.95
}

// Health check endpoint with enhanced diagnostics
app.get('/api/health', (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      server: true,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    }
  };
  
  res.json(healthStatus);
});

// System information endpoint (for monitoring)
app.get('/api/system', (req, res) => {
  res.json({
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, error);
  
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again.',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || `req_${Date.now()}`
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.originalUrl,
    message: 'The requested endpoint does not exist.',
    availableEndpoints: ['/api/chat', '/api/health', '/api/system']
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Enhanced server startup
const server = app.listen(PORT, () => {
  console.log('\n🚀 AI Customer Support Server');
  console.log('━'.repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ API Key: ${apiKey ? '***configured***' : '❌ MISSING'}`);
  console.log(`✅ CORS enabled for: http://localhost:3000`);
  console.log(`✅ Rate limiting: ${RATE_LIMIT_MAX_REQUESTS} requests/minute`);
  console.log('━'.repeat(50));
  console.log('📋 Available endpoints:');
  console.log('   POST /api/chat - Main chat endpoint');
  console.log('   GET  /api/health - Health check');
  console.log('   GET  /api/system - System information');
  console.log('━'.repeat(50));
  console.log('🎯 Ready to accept requests!\n');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
        server.listen(PORT + 1, () => {
            console.log(`Server running on port ${PORT + 1}`);
        });
    } else {
        console.error('Server error:', err);
    }
});
