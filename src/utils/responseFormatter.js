// Enhanced response formatting utilities for professional chatbot

export function formatResponse(text) {
  if (!text || typeof text !== 'string') return text;
  
  let formatted = text.trim()
    // Remove AI greeting fluff
    .replace(/^(okay[.,]?\s*i('?m)?\s*(here\s*to\s*help|happy\s*to\s*assist)[.,]?\s*)/gi, '')
    .replace(/^(hello[!]?\s*|hi\s*there[!]?\s*|greetings[!]?\s*)/gi, '')
    .replace(/^(thank\s*you\s*for\s*(contacting|reaching\s*out)[.,]?\s*)/gi, '')
    
    // Clean up asterisks and formatting marks
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold asterisks
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic asterisks
    .replace(/`([^`]+)`/g, '$1') // Remove code formatting
    .replace(/^\*\s+/gm, '• ') // Convert asterisk bullets to proper bullets
    
    // Clean up excessive line breaks and spacing
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{3,}/g, ' ')
    
    // Standardize bullet points
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^\s*[\u2022\u2023\u25E6\u2043\u2219]\s*/gm, '• ')
    
    // Enhance numbered lists without extra formatting
    .replace(/^(\d+[\.)]\s*)/gm, '$1 ')
    
    // Clean up common AI response patterns
    .replace(/\bI('d|would)\s+be\s+(happy|glad|pleased)\s+to\s+(help|assist)\b/gi, 'I can help')
    .replace(/\bplease\s+(don't|do\s+not)\s+hesitate\s+to\b/gi, 'feel free to')
    .replace(/\bis\s+there\s+anything\s+else\s+I\s+can\s+help\s+(you\s+)?with\?/gi, '')
    
    // Remove trailing pleasantries
    .replace(/\s*let\s+me\s+know\s+if\s+(you\s+)?(have\s+)?(any\s+)?(other\s+)?questions[!.]?\s*$/gi, '')
    .replace(/\s*feel\s+free\s+to\s+(ask|reach\s+out)[!.]?\s*$/gi, '')
    
    // Remove confidence JSON if present
    .replace(/\{["']?confidence["']?\s*:\s*[0-9.]+\}/g, '')
    
    .trim();

  return formatted;
}

export const QUICK_QUESTIONS = [
  { text: "Reset my password", icon: "🔐" },
  { text: "Check order status", icon: "📦" },
  { text: "Return policy info", icon: "↩️" },
  { text: "Contact support team", icon: "💬" },
  { text: "Technical assistance", icon: "🔧" },
  { text: "Billing questions", icon: "💳" }
];

export const formatBotResponse = (response) => {
  if (!response || typeof response !== 'string') return response;

  let formatted = formatResponse(response);
  
  // Advanced structure enhancement with cleaner formatting
  formatted = enhanceStructure(formatted);
  
  // Apply professional tone adjustments
  formatted = applyProfessionalTone(formatted);
  
  return formatted;
};

function enhanceStructure(text) {
  let enhanced = text;
  
  // Convert common patterns to better formatting without excessive markup
  enhanced = enhanced
    // Convert steps to simple numbered format
    .replace(/^(step\s+)(\d+)[:\s]+(.+)$/gmi, '$2. $3')
    .replace(/^(first|second|third|fourth|fifth)[,:\s]+(.+)$/gmi, (match, ordinal, content) => {
      const numbers = { first: '1', second: '2', third: '3', fourth: '4', fifth: '5' };
      return `${numbers[ordinal.toLowerCase()]}. ${content}`;
    })
    
    // Simple headings without markdown
    .replace(/^(how\s+to[:\s]+.+)$/gmi, '$1')
    .replace(/^(important[:\s]+.+)$/gmi, '⚠️ Important: $1')
    .replace(/^(note[:\s]+.+)$/gmi, '📝 Note: $1')
    .replace(/^(tip[:\s]+.+)$/gmi, '💡 Tip: $1')
    
    // Clean contact information without bold formatting
    .replace(/(\b(?:email|e-mail)\s*:?\s*)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi, '$1$2')
    .replace(/(\b(?:phone|call|tel)\s*:?\s*)([\d\s\-\(\)]{10,})/gi, '$1$2')
    
    // Clean time-based information
    .replace(/(\d+)\s*(hours?|days?|weeks?|months?)/gi, '$1 $2')
    
    // Clean currency and numbers
    .replace(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '$$$1')
    .replace(/(\d+)%/g, '$1%');
  
  return enhanced;
}

function applyProfessionalTone(text) {
  return text
    // Replace casual language with professional alternatives
    .replace(/\byeah\b/gi, 'yes')
    .replace(/\bokay\b/gi, 'alright')
    .replace(/\bkinda\b/gi, 'somewhat')
    .replace(/\bgonna\b/gi, 'going to')
    .replace(/\bwanna\b/gi, 'want to')
    
    // Enhance certainty language
    .replace(/\bi\s+think\s+/gi, 'I believe ')
    .replace(/\bmaybe\s+/gi, 'possibly ')
    .replace(/\bprobably\s+/gi, 'likely ')
    
    // Professional closings
    .replace(/\bthanks\b/gi, 'Thank you')
    .replace(/\bbye\b/gi, 'Goodbye')
    
    // Remove remaining asterisks that might have been missed
    .replace(/\*/g, '');
}

export const QUICK_ACTIONS = [
  { 
    id: 1, 
    text: "🚀 Getting Started", 
    prompt: "How do I get started with your service?",
    category: "onboarding",
    description: "Learn the basics and setup process"
  },
  { 
    id: 2, 
    text: "💰 Pricing Plans", 
    prompt: "What are your pricing options and plans?",
    category: "billing",
    description: "Explore pricing tiers and features"
  },
  { 
    id: 3, 
    text: "🔧 Technical Support", 
    prompt: "I need help with a technical issue",
    category: "technical",
    description: "Get help with technical problems"
  },
  { 
    id: 4, 
    text: "📞 Contact Sales", 
    prompt: "How can I speak with your sales team?",
    category: "sales",
    description: "Connect with our sales representatives"
  },
  { 
    id: 5, 
    text: "📋 Documentation", 
    prompt: "Where can I find your documentation and guides?",
    category: "resources",
    description: "Access guides and documentation"
  },
  { 
    id: 6, 
    text: "🛡️ Security & Privacy", 
    prompt: "Tell me about your security and privacy policies",
    category: "security",
    description: "Learn about data protection and security"
  },
  {
    id: 7,
    text: "📦 Order Status",
    prompt: "How can I check my order status and tracking?",
    category: "orders",
    description: "Track your orders and shipments"
  },
  {
    id: 8,
    text: "↩️ Returns & Refunds",
    prompt: "What is your return and refund policy?",
    category: "returns",
    description: "Learn about returns and refunds"
  }
];

// Enhanced response categorization
export const categorizeResponse = (content) => {
  const categories = {
    technical: /technical|error|bug|issue|problem|not working|broken/i,
    billing: /billing|payment|charge|invoice|subscription|price|cost|fee/i,
    shipping: /shipping|delivery|tracking|shipped|package|order/i,
    account: /account|login|password|profile|settings|username/i,
    general: /help|support|question|information|about/i
  };
  
  for (const [category, pattern] of Object.entries(categories)) {
    if (pattern.test(content)) {
      return category;
    }
  }
  
  return 'general';
};

// Create structured response objects with cleaner content
export const createStructuredResponse = (content, type = 'info', metadata = {}) => {
  const icons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    help: '🤔',
    contact: '📞',
    technical: '🔧',
    billing: '💳',
    shipping: '📦',
    security: '🛡️'
  };
  
  return {
    icon: icons[type] || icons.info,
    content: formatBotResponse(content),
    type,
    category: categorizeResponse(content),
    timestamp: new Date().toISOString(),
    ...metadata
  };
};

// Extract action items from responses
export const extractActionItems = (response) => {
  const actionPatterns = [
    /(?:please|you should|you need to|make sure to|remember to)\s+(.+?)(?:\.|$)/gi,
    /(?:step \d+[:\s]+)(.+?)(?:\n|$)/gi,
    /(?:\d+\.\s+)(.+?)(?:\n|$)/gi
  ];
  
  const actions = [];
  
  actionPatterns.forEach(pattern => {
    const matches = [...response.matchAll(pattern)];
    matches.forEach(match => {
      if (match[1] && match[1].trim()) {
        actions.push(match[1].trim());
      }
    });
  });
  
  return [...new Set(actions)]; // Remove duplicates
};

// Response quality scoring
export const scoreResponseQuality = (response, userQuery) => {
  let score = 0.5; // Base score
  
  // Length scoring
  if (response.length > 50 && response.length < 500) score += 0.1;
  if (response.length > 100 && response.length < 300) score += 0.1;
  
  // Structure scoring
  if (response.includes('•') || response.includes('**')) score += 0.1;
  if (response.match(/\d+\./)) score += 0.1; // Numbered lists
  if (response.includes('##')) score += 0.05; // Headers
  
  // Content relevance (basic keyword matching)
  const queryWords = userQuery.toLowerCase().split(/\s+/);
  const responseWords = response.toLowerCase().split(/\s+/);
  const commonWords = queryWords.filter(word => 
    word.length > 3 && responseWords.includes(word)
  );
  score += Math.min(0.2, commonWords.length * 0.05);
  
  // Professionalism indicators
  if (response.includes('**') && response.includes('•')) score += 0.05;
  if (!response.includes('I think') && !response.includes('maybe')) score += 0.05;
  
  // Deduct for poor quality indicators
  if (response.includes('I don\'t know') || response.includes('I\'m not sure')) score -= 0.2;
  if (response.length < 30) score -= 0.2;
  
  return Math.max(0.1, Math.min(0.95, score));
};

export default {
  formatResponse,
  formatBotResponse,
  QUICK_ACTIONS,
  QUICK_QUESTIONS,
  createStructuredResponse,
  categorizeResponse,
  extractActionItems,
  scoreResponseQuality
};
