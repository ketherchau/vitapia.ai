import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local JSON Failsafe Logger
function saveLeadLocally(leadData: Record<string, unknown>) {
  try {
    const leadsDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(leadsDir)) fs.mkdirSync(leadsDir, { recursive: true });
    
    const leadsFile = path.join(leadsDir, 'leads.json');
    let leads = [];
    if (fs.existsSync(leadsFile)) {
      leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
    }
    leads.push({ ...leadData, timestamp: new Date().toISOString() });
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    console.log("[*] Waitlist lead safely written to local disk (failsafe).");
  } catch (err) {
    console.error("Failed to save waitlist lead locally:", err);
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Extract Device & Network Telemetry
    const userAgent = request.headers.get('user-agent') || 'Unknown Device';
    
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'Unknown IP');

    // 2. Resolve Geo-location from IP
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

    // 3. Save to local disk immediately (FAILSAFE)
    saveLeadLocally({ source: 'waitlist_modal', email, ip, geoInfo, userAgent });

    // 4. Format the Telegram Payload
    const message = `🚨 *New Vitapia.ai Waitlist Request* 🚨

📧 *Email:* \`${email}\`
📅 *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' })}

🌐 *Security & Telemetry:*
📍 *IP Origin:* \`${ip}\`
🌍 *Location:* ${geoInfo}
📱 *Device UA:* \`${userAgent}\``;

    // 5. Dispatch to Telegram with Exponential Backoff Retries
    if (botToken && chatId) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
          });
          if (tgRes.ok) {
            console.log("[*] Telegram waitlist notification dispatched successfully.");
            break; // Success, exit retry loop
          } else {
            console.warn(`[!] Telegram waitlist attempt ${attempt} failed with status: ${tgRes.status}`);
          }
        } catch (err) {
          console.error(`[!] Telegram waitlist network error on attempt ${attempt}:`, err);
        }
        if (attempt < 3) await new Promise(res => setTimeout(res, 1000 * attempt)); // wait 1s, 2s...
      }
    } else {
      console.error("Missing Telegram configuration");
      // Don't fail the request to the user if Telegram is misconfigured, since we saved it locally!
    }

    return NextResponse.json({ success: true, message: 'Waitlist joined successfully' });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
