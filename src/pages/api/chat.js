import prisma from '../../lib/db.js';
import { getEmbedding, generateChatResponse } from '../../lib/gemini.js';
import { topKMatches } from '../../lib/vector.js';
import { buildPromptWithContext, parseConfidence, cleanResponse, shouldEscalate } from '../../lib/prompts.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, message, userId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create or get session
    let session;
    if (sessionId) {
      session = await prisma.session.findUnique({
        where: { id: sessionId }
      });
    }

    if (!session) {
      session = await prisma.session.create({
        data: {
          userId: userId || null,
          lastActiveAt: new Date()
        }
      });
    } else {
      // Update last active time
      await prisma.session.update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() }
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: message,
        createdAt: new Date()
      }
    });

    // Get embedding for user query
    const queryEmbedding = await getEmbedding(message);

    // Load all FAQs with embeddings
    const allFAQs = await prisma.fAQ.findMany({
      where: {
        embedding: { not: null }
      }
    });

    // Parse embeddings and prepare for similarity search
    const faqsWithEmbeddings = allFAQs
      .map(faq => {
        try {
          return {
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            embedding: JSON.parse(faq.embedding)
          };
        } catch (e) {
          return null;
        }
      })
      .filter(faq => faq !== null);

    // Find top 5 most relevant FAQs
    const topMatches = topKMatches(queryEmbedding, faqsWithEmbeddings, 5);

    // Get relevant FAQ details
    const relevantFAQs = topMatches.map(match => ({
      question: match.item.question,
      answer: match.item.answer,
      score: match.score
    }));

    // Get conversation history (last 6 messages)
    const conversationHistory = await prisma.message.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 6
    });

    const historyReversed = conversationHistory.reverse();

    // Build prompt with context
    const prompt = buildPromptWithContext(message, relevantFAQs, historyReversed);

    // Generate response using Gemini
    const aiResponse = await generateChatResponse(prompt);

    // Parse confidence and clean response
    const confidence = parseConfidence(aiResponse);
    const cleanedResponse = cleanResponse(aiResponse);

    // Save assistant message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: cleanedResponse,
        confidence: confidence,
        metadata: JSON.stringify({
          topFAQs: relevantFAQs.slice(0, 3).map(f => ({ question: f.question, score: f.score }))
        })
      }
    });

    // Check if escalation is needed
    const needsEscalation = shouldEscalate(message, confidence);

    if (needsEscalation && !session.escalated) {
      await prisma.session.update({
        where: { id: session.id },
        data: { escalated: true }
      });
    }

    return res.status(200).json({
      response: cleanedResponse,
      confidence: confidence,
      sessionId: session.id,
      escalated: needsEscalation,
      relevantFAQs: relevantFAQs.slice(0, 3)
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
