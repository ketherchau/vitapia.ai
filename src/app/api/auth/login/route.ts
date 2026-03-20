import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Hardcoded MVP Admin Credentials
    if (email === "hikari@vitapia.ai" && password === "Rockman123!") {
      return NextResponse.json({ success: true, message: "Authenticated", user: { name: "Hikari", role: "Admin" } });
    }

    // Invalid credentials
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
