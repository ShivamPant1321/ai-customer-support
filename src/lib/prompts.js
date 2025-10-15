/**
 * System prompt for the AI assistant
 */
const SYSTEM_PROMPT = `You are a helpful and accurate customer support assistant. Your goal is to provide precise, helpful answers based on the FAQ knowledge base provided to you.

Guidelines:
1. Use the FAQ excerpts provided to answer questions accurately
2. Be concise but thorough in your responses
3. Use simple, clean formatting without excessive asterisks or markdown
4. Use bullet points (•) for lists, not asterisks (*)
5. Use numbered lists (1. 2. 3.) for steps, not bold formatting
6. If you're unsure or the question is outside your knowledge base, say you'll escalate to a human agent
7. Always be polite and professional
8. After your response, include ONLY a confidence score in JSON format
9. Do not use bold (**text**) or italic (*text*) formatting
10. Keep responses clean and readable

Format your response as plain text with simple formatting:
[Your helpful answer here]

{"confidence": 0.85}`;

/**
 * Build a prompt with context for the AI
 */
export function buildPromptWithContext(userMessage, faqContext, conversationHistory) {
  const faqText = faqContext.map((faq, i) => 
    `FAQ${i + 1}:\nQ: ${faq.question}\nA: ${faq.answer}\n`
  ).join('\n');

  const historyText = conversationHistory.map(msg => 
    `${msg.role.toUpperCase()}: ${msg.content}`
  ).join('\n');

  return `${SYSTEM_PROMPT}

CONVERSATION HISTORY:
${historyText || 'No previous messages'}

RELEVANT FAQ EXCERPTS:
${faqText || 'No relevant FAQs found'}

CURRENT USER MESSAGE: ${userMessage}

Please provide your response followed by a confidence score in JSON format.`;
}

/**
 * Parse confidence from AI response
 */
export function parseConfidence(text) {
  try {
    // Try to find JSON confidence object
    const match = text.match(/\{["']?confidence["']?\s*:\s*([0-9.]+)\}/);
    if (match) {
      const confidence = parseFloat(match[1]);
      return isNaN(confidence) ? 0.7 : Math.min(Math.max(confidence, 0), 1);
    }
  } catch (error) {
    console.error('Error parsing confidence:', error);
  }
  return 0.7; // Default confidence
}

/**
 * Remove confidence JSON and clean asterisks from response text
 */
export function cleanResponse(text) {
  return text
    .replace(/\{["']?confidence["']?\s*:\s*[0-9.]+\}/g, '') // Remove confidence JSON
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold asterisks
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic asterisks
    .replace(/`([^`]+)`/g, '$1') // Remove code formatting
    .replace(/^\*\s+/gm, '• ') // Convert asterisk bullets to proper bullets
    .replace(/\*/g, '') // Remove any remaining asterisks
    .trim();
}

/**
 * Check if message should be escalated
 */
export function shouldEscalate(message, confidence) {
  // Low confidence
  if (confidence < 0.5) return true;
  
  // Keywords that indicate need for human assistance
  const escalationKeywords = [
    'refund',
    'fraud',
    'legal',
    'lawsuit',
    'speak to human',
    'talk to person',
    'manager',
    'escalate',
    'complaint',
    'angry',
    'unacceptable'
  ];
  
  const lowerMessage = message.toLowerCase();
  return escalationKeywords.some(keyword => lowerMessage.includes(keyword));
}
