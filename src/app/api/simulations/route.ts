import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Simulation from '@/lib/models/Simulation';
import User from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const user_id = "admin_hikari";
    const num_agents = 100; // Fixed size for MVP pitch
    const cost_credits = num_agents; // 1 credit = 1 agent

    // 1. Check and deduct credits
    const user = await User.findOne({ user_id });
    if (!user || user.credits < cost_credits) {
      return NextResponse.json({ error: "Insufficient simulation credits" }, { status: 402 });
    }
    
    user.credits -= cost_credits;
    await user.save();

    // 2. Generate a random SIM-XXXX ID
    const sim_id = `SIM-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newSim = new Simulation({
      sim_id,
      user_id,
      name: body.projectName || "Untitled Pulse Check",
      audience_profile: `HK Baseline (${num_agents} Agents)`,
      status: "Running",
      scenario_prompt: body.scenarioPrompt || "Default scenario parameters",
      questions: body.questions || [],
      cost_credits,
    });

    await newSim.save();

    // 3. Trigger external orchestrator server via webhook
    const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://54.169.3.192:4000/api/run-simulation';
    
    fetch(ORCHESTRATOR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        sim_id, 
        num_agents // Pass the explicit agent count
      })
    }).catch(err => console.error("Webhook to orchestrator failed:", err));

    return NextResponse.json({ success: true, sim_id });
  } catch (error) {
    console.error("Simulation Creation Error:", error);
    return NextResponse.json({ error: "Failed to create simulation" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const sims = await Simulation.find({}).sort({ created_at: -1 }).lean();
    return NextResponse.json({ success: true, simulations: sims });
  } catch (error) {
    console.error("Simulation Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch simulations" }, { status: 500 });
  }
}

