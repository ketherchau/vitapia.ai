import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Missing Telegram configuration");
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // 1. Extract Device & Network Telemetry
    const userAgent = request.headers.get('user-agent') || 'Unknown Device';
    
    // Attempt to get real IP from proxies (Vercel, Cloudflare, Nginx)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'Unknown IP');

    // 2. Resolve Geo-location from IP
    let geoInfo = 'Unknown Location';
    if (ip !== 'Unknown IP' && ip !== '::1' && ip !== '127.0.0.1') {
      try {
        // Fast, free, no-auth IP geolocation API
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

    // 3. Format the Telegram Payload
    const message = `🚨 *New Vitapia.ai Waitlist Request* 🚨

📧 *Email:* \`${email}\`
📅 *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' })}

🌐 *Security & Telemetry:*
📍 *IP Origin:* \`${ip}\`
🌍 *Location:* ${geoInfo}
📱 *Device UA:* \`${userAgent}\``;

    // 4. Dispatch to Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Telegram API Error:", errorData);
      return NextResponse.json({ error: 'Failed to notify admin' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Waitlist joined successfully' });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
