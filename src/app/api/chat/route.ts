import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are the official AI Assistant for Vitapia.ai, Asia's first population-scale AI prediction platform.
Your job is to answer visitor questions concisely and professionally. 

Key Information:
- Tagline: "Synthetic Societies. Replace slow surveys with high-fidelity digital twins of Hong Kong."
- Problem: Market research is broken, slow, expensive, and biased.
- Solution: We generate thousands of AI agents mathematically mirroring real census demographics (Age, Income, Housing, Occupation).
- Technology: We use "Deep Demographic Roleplay" with Chain-of-Thought budgeting.
- Accuracy: 97.2% Statistical Accuracy in Food Expenditure and 89.1% Discretionary Spend vs Real HK Ground Truth.
- Business Model: Tier 1 (Pulse Check) for one-off tests; Tier 2 (Enterprise Custom) for monthly SaaS.
- Roadmap: Phase 1 (Engine Scaling), Phase 2 (B2B Pilots), Phase 3 (Macro Forecasting).

CRITICAL INSTRUCTIONS:
1. Keep answers VERY SHORT and punchy (1 to 2 sentences maximum). Do not write long paragraphs.
2. If the user asks how to get started, wants to talk to sales/a human, or asks a question outside your context, reply exactly with: "I'd be happy to connect you with our team! Please reply with your email address and we'll reach out shortly."
3. If the user provides an email address in their message, reply exactly with: "Thank you! I've successfully notified our team. We'll be in touch soon."`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // 1. Intercept user message to check for email addresses
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const emailMatch = lastMessage.content.match(emailRegex);
      
      if (emailMatch) {
        const email = emailMatch[0];
        
        // Extract Telemetry & Send to Telegram
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (botToken && chatId) {
          const userAgent = request.headers.get('user-agent') || 'Unknown Device';
          const forwardedFor = request.headers.get('x-forwarded-for');
          const realIp = request.headers.get('x-real-ip');
          const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'Unknown IP');
          
          let geoInfo = 'Unknown Location';
          if (ip !== 'Unknown IP' && ip !== '::1' && ip !== '127.0.0.1') {
            try {
              const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp`);
              const geoData = await geoRes.json();
              if (geoData.status === 'success') {
                geoInfo = `${geoData.city}, ${geoData.regionName}, ${geoData.country} (ISP: ${geoData.isp})`;
              }
            } catch (e) {
              console.error("Geo IP fetch failed:", e);
            }
          } else {
            geoInfo = 'Localhost / Internal Network';
          }

          // Compile chat history for context
          const chatHistory = messages
            .filter((m: any) => m.role !== 'system') // Exclude the massive system prompt
            .map((m: any) => `*${m.role === 'user' ? 'Visitor' : 'Vitapia'}*: ${m.content}`)
            .join('\n\n');

          const telegramMsg = `🚨 *New Vitapia.ai Chatbot Lead* 🚨\n\n📧 *Email:* \`${email}\`\n📅 *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' })}\n\n🌐 *Security & Telemetry:*\n📍 *IP Origin:* \`${ip}\`\n🌍 *Location:* ${geoInfo}\n📱 *Device UA:* \`${userAgent}\`\n\n💬 *Conversation History:*\n${chatHistory}`;
          
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: telegramMsg, parse_mode: 'Markdown' }),
          }).catch(err => console.error("Telegram API Error:", err));
        }
      }
    }

    // 2. Proceed with standard LLM Request
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfiguration: API key missing' }, { status: 500 });
    }

    const payload = {
      model: "google/gemini-3.1-flash-lite-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.3
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vitapia.ai',
        'X-Title': 'Vitapia.ai Assistant'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      return NextResponse.json({ error: 'Failed to communicate with AI engine' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
