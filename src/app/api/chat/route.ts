import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are the official AI Assistant for Vitapia.ai, Asia's first population-scale AI prediction platform.
Your job is to answer visitor questions concisely and professionally. 
Key Information:
- Tagline: "Synthetic Societies. Replace slow surveys with high-fidelity digital twins of Hong Kong."
- Problem: Market research is broken, slow, expensive, and biased.
- Solution: We generate thousands of AI agents mathematically mirroring real census demographics (Age, Income, Housing, Occupation).
- Technology: We use "Deep Demographic Roleplay" with Chain-of-Thought budgeting. Agents simulate real-world decisions without basic RAG hallucination.
- Accuracy: We achieved 97.2% Statistical Accuracy in Food Expenditure Share prediction vs Real HK Ground Truth (N=100 pilot study) and 89.1% Discretionary Spend Accuracy.
- Business Model: Tier 1 (Pulse Check) for one-off tests; Tier 2 (Enterprise Custom) for monthly SaaS where clients upload their own CRM data.
- Roadmap: Phase 1 (Engine Scaling), Phase 2 (B2B Pilots), Phase 3 (Macro Forecasting like City Development Analysis).

Keep answers under 3 paragraphs. Be confident, high-tech, and emphasize mathematical validation and speed.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

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
      temperature: 0.5
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
