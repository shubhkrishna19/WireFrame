import OpenAI from 'openai';
import { config } from '../config/env';
import { logger } from '../config/logger';
import { query } from '../config/database';

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
if (config.openai.apiKey) {
  openai = new OpenAI({
    apiKey: config.openai.apiKey,
  });
}

// Knowledge base for common questions
const knowledgeBase = {
  orders: [
    "I can help track your order. Please provide your order number.",
    "To track your order, I'll need the order number from your confirmation email.",
    "For order status, please share your order number."
  ],
  returns: [
    "We offer a 30-day return policy for unworn items with tags attached.",
    "To initiate a return, please provide your order number and reason for return.",
    "Premium members enjoy extended return periods."
  ],
  shipping: [
    "Standard shipping takes 3-5 business days.",
    "Premium members get free shipping, VIP members get free express shipping.",
    "Express shipping is available for an additional fee."
  ],
  payments: [
    "We accept all major credit cards, PayPal, and Buy Now Pay Later options.",
    "Payment is processed securely through Razorpay or other trusted gateways.",
    "You can update your payment method in your account settings."
  ],
  sizes: [
    "Our size guide varies by product. Check each product page for detailed measurements.",
    "For sizing help, please let me know your measurements (chest, waist, hips).",
    "We offer an AI-powered size recommendation tool on product pages."
  ]
};

// Context-aware response patterns
const contextPatterns = [
  { 
    keywords: ['track', 'order', 'shipping', 'status'], 
    category: 'orders',
    priority: 1
  },
  { 
    keywords: ['return', 'refund', 'cancel', 'exchange'], 
    category: 'returns',
    priority: 1
  },
  { 
    keywords: ['ship', 'delivery', 'arrive', 'post'], 
    category: 'shipping',
    priority: 1
  },
  { 
    keywords: ['pay', 'card', 'payment', 'money', 'price'], 
    category: 'payments',
    priority: 1
  },
  { 
    keywords: ['size', 'fit', 'measure', 'tight', 'loose'], 
    category: 'sizes',
    priority: 1
  },
  { 
    keywords: ['hello', 'hi', 'hey', 'greet'], 
    category: 'greeting',
    priority: 0
  },
  { 
    keywords: ['recommend', 'suggest', 'help me choose'], 
    category: 'recommendations',
    priority: 1
  }
];

// Enhanced AI response function with context and fallback
export const getAIResponse = async (
  userMessage: string, 
  context?: any
): Promise<string> => {
  try {
    // Normalize the user message
    const normalizedMessage = userMessage.toLowerCase().trim();
    
    // Check knowledge base first for quick responses
    const knowledgeResponse = getKnowledgeBasedResponse(normalizedMessage);
    if (knowledgeResponse) {
      return knowledgeResponse;
    }

    // If not in knowledge base and OpenAI is available, use OpenAI
    if (!openai) {
      return getFallbackResponse(userMessage);
    }

    const prompt = buildOpenAIPrompt(userMessage, context);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Mulary's AI Shopping Assistant. You are helpful, friendly, and knowledgeable about the Mulary e-commerce platform.
          You can help with:
          - Order tracking and status
          - Return and refund policies
          - Shipping information
          - Payment methods and options
          - Size guides and recommendations
          - Product suggestions based on preferences
          - General customer support questions

          Be concise but helpful. If the question is about product recommendations, ask for style preferences, budget, or specific needs to provide better suggestions.
          If you cannot find specific information, suggest checking the Help Center or speaking with a human agent.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content?.trim() || '';
    
    // Store in cache for similar questions
    await cacheResponse(normalizedMessage, response);
    
    return response || "I understand you're asking about that. Let me help you find the information you need.";
  } catch (error: any) {
    logger.error('OpenAI API error:', error);
    
    // Fallback response if OpenAI fails
    return getFallbackResponse(userMessage);
  }
};

// Check knowledge base for quick responses
const getKnowledgeBasedResponse = (message: string): string | null => {
  for (const pattern of contextPatterns) {
    for (const keyword of pattern.keywords) {
      if (message.includes(keyword)) {
        if (pattern.category === 'greeting') {
          return 'Hello! 👋 I\'m your AI shopping assistant. How can I help you today? You can ask about orders, returns, shipping, payments, size guides, or product recommendations.';
        }
        if (pattern.category === 'recommendations') {
          return 'I\'d love to help you find the perfect items! Could you tell me more about what you\'re looking for? What style, occasion, or budget are you shopping for?';
        }
        
        const responses = knowledgeBase[pattern.category as keyof typeof knowledgeBase];
        if (responses && responses.length > 0) {
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
  }
  
  return null;
};

// Build prompt for OpenAI with context
const buildOpenAIPrompt = (message: string, context?: any): string => {
  let prompt = `User message: "${message}"`;
  
  if (context) {
    prompt += `\n\nAdditional context: ${JSON.stringify(context)}`;
  }
  
  prompt += `\n\nPlease provide a helpful, friendly response as Mulary's AI Shopping Assistant.`;
  
  return prompt;
};

// Cache response for similar questions (in production, use Redis)
const cacheResponse = async (question: string, response: string): Promise<void> => {
  // In a real implementation, you'd store this in Redis or a cache table
  // For now, we'll skip caching in this basic version
  try {
    await query(`
      INSERT INTO ai_chat_cache (question, response, accessed_count, last_accessed)
      VALUES (?, ?, 1, datetime('now'))
      ON CONFLICT (question) 
      DO UPDATE SET accessed_count = ai_chat_cache.accessed_count + 1, last_accessed = datetime('now')
    `, [question, response]);
  } catch (error) {
    logger.warn('Failed to cache AI response:', error);
  }
};

// Get fallback response if OpenAI fails
const getFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! I\'m your AI shopping assistant. How can I help you today?';
  }
  
  if (lowerMessage.includes('thank')) {
    return 'You\'re welcome! Is there anything else I can help you with?';
  }
  
  if (lowerMessage.includes('help')) {
    return 'I can help you with order tracking, returns, shipping info, payment options, size guides, and product recommendations. What would you like to know?';
  }
  
  // Default fallback
  return 'I understand you\'re asking about "' + message + '". Let me connect you with a human agent who can better assist you. In the meantime, you can browse our Help Center or check out our FAQs.';
};

// Get cached response (in production, use Redis)
export const getCachedResponse = async (question: string): Promise<string | null> => {
  try {
    const result = await query(`
      SELECT response FROM ai_chat_cache 
      WHERE question = ? AND accessed_count > 2
      ORDER BY last_accessed DESC
      LIMIT 1
    `, [question]);
    
    return result.rows[0]?.response || null;
  } catch (error) {
    logger.warn('Failed to get cached AI response:', error);
    return null;
  }
};

// Product recommendation helper
export const getProductRecommendations = async (preferences: any): Promise<any[]> => {
  try {
    // Build query based on preferences
    let baseQuery = 'SELECT * FROM products WHERE is_active = true';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (preferences.budget) {
      baseQuery += ` AND price <= $${paramIndex}`;
      params.push(preferences.budget);
      paramIndex++;
    }
    
    if (preferences.category) {
      baseQuery += ` AND category_id IN (SELECT id FROM categories WHERE name LIKE $${paramIndex})`;
      params.push(`%${preferences.category}%`);
      paramIndex++;
    }
    
    if (preferences.style) {
      baseQuery += ` AND (description LIKE $${paramIndex} OR specifications ? $${paramIndex})`;
      params.push(`%${preferences.style}%`);
      paramIndex++;
    }
    
    baseQuery += ' ORDER BY rating DESC, created_at DESC LIMIT 5';
    
    const result = await query(baseQuery, params);
    return result.rows;
  } catch (error) {
    logger.error('Error getting product recommendations:', error);
    return [];
  }
};

export default {
  getAIResponse,
  getCachedResponse,
  getProductRecommendations
};
