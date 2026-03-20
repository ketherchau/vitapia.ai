import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import crypto from 'crypto';

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
        organization: "Vitapia HQ",
        api_key: `vk_test_${crypto.randomBytes(16).toString("hex")}`,
        credits: 1250,
        plan: "Free"
      });
    } else if (!user.api_key) {
      await User.updateOne({ user_id: "admin_hikari" }, { $set: { api_key: `vk_test_${crypto.randomBytes(16).toString("hex")}` } });
      user = await User.findOne({ user_id: "admin_hikari" }).lean();
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("User Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const user_id = "admin_hikari";
    
    if (body.action === "generate_key") {
       const newKey = `vk_live_${crypto.randomBytes(16).toString("hex")}`;
       await User.updateOne({ user_id }, { $set: { api_key: newKey } });
       return NextResponse.json({ success: true, api_key: newKey });
    }
    
    const updateData: Record<string, string> = {};
    if (body.name) updateData.name = body.name;
    if (body.organization) updateData.organization = body.organization;
    
    await User.updateOne({ user_id }, { $set: updateData });
    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error("User Update Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
