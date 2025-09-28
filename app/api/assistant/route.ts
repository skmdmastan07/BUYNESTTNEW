import { NextRequest, NextResponse } from 'next/server';
import { DataService, SEED_PRODUCTS } from '@/lib/data';

// Simple FAQ responses for fallback mode
const FAQ_RESPONSES: { [key: string]: string } = {
  'discount': 'You can earn discounts through our streak system! Order weekly for 3 consecutive weeks to unlock a 3% discount, or monthly for 3+ months to get an additional 2% bonus. Your current progress is shown on your dashboard.',
  'streak': 'Our streak system rewards consistent ordering. Weekly streak: order every week for 3 weeks = 3% discount. Monthly streak: order every month = 2% bonus after 3 months. Keep up the great work!',
  'delivery': 'Free delivery is available on orders above ₹2000. You can see your progress toward free delivery on your dashboard. Add more items to your cart to reach the threshold!',
  'free delivery': 'Orders above ₹2000 qualify for free delivery. Check your cart total on the dashboard to see how close you are!',
  'trending': 'Based on your purchase history, trending items in your categories include Basmati Rice, Masala Tea, and Mixed Namkeen. Check out our recommendations page for more personalized picks!',
  'snacks': 'Popular snack items include Mixed Namkeen Pack (₹45), Chocolate Biscuits (₹25), and Instant Noodles (₹15). All are in stock and ready to order!',
  'rice': 'We recommend Basmati Rice Premium (₹120/kg) from Grain Masters Ltd. It has a 4.5-star rating and is frequently bought by retailers like you.',
  'help': 'I can help you with product recommendations, discount information, delivery details, and finding specific items. What would you like to know about?',
};

async function callOpenAI(message: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful shopping assistant for Buynestt, a platform for neighborhood retailers. You help with product recommendations, discounts, and general shopping questions. 

Key features to know about:
- Streak discounts: 3% for 3 consecutive weeks of ordering, 2% bonus for monthly streaks
- Free delivery on orders above ₹2000
- Product categories: Groceries, Snacks, Beverages, Dairy, Spices
- Always be friendly, helpful, and concise. Speak like a helpful local shopkeeper.

If asked about specific products, mention items like Basmati Rice Premium, Masala Tea Powder, Mixed Namkeen Pack, etc.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t process your request right now.';
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific keywords
  for (const [keyword, response] of Object.entries(FAQ_RESPONSES)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  // Product search
  if (lowerMessage.includes('show') || lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    if (lowerMessage.includes('snack')) {
      const snacks = SEED_PRODUCTS.filter(p => p.category === 'Snacks');
      return `Here are some popular snacks: ${snacks.slice(0, 3).map(p => `${p.name} (₹${p.price})`).join(', ')}. You can find more on our recommendations page!`;
    }
    
    if (lowerMessage.includes('rice')) {
      const rice = SEED_PRODUCTS.find(p => p.name.includes('Rice'));
      return rice ? `I recommend ${rice.name} at ₹${rice.price} per ${rice.pack_size}. It has a ${rice.rating}-star rating from ${rice.distributor}.` : 'Let me check our rice options for you.';
    }
    
    return 'I can show you trending products in categories like Groceries, Snacks, Beverages, and more. Check out your personalized recommendations page for the best picks for your store!';
  }

  // Default response
  return 'I\'m here to help with product recommendations, discounts, delivery info, and more! Try asking me about "trending snacks", "how to get discounts", or "free delivery". What would you like to know?';
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let response: string;

    try {
      // Try OpenAI first
      response = await callOpenAI(message);
    } catch (error) {
      // Fallback to rule-based responses
      console.log('OpenAI unavailable, using fallback responses');
      response = getFallbackResponse(message);
    }

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}