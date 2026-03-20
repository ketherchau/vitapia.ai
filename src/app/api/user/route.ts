import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Using a hardcoded demo user for MVP
    let user = await User.findOne({ user_id: "admin_hikari" }).lean();
    
    // Seed user if missing
    if (!user) {
      user = await User.create({
        user_id: "admin_hikari",
        email: "admin@vitapia.ai",
        name: "Degen Higgs",
        credits: 1250,
        plan: "Free"
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
