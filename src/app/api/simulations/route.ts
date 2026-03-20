import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Simulation from '@/lib/models/Simulation';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Generate a random SIM-XXXX ID
    const sim_id = `SIM-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newSim = new Simulation({
      sim_id,
      user_id: "admin_hikari",
      name: body.projectName || "Untitled Pulse Check",
      audience_profile: "HK Baseline (1,000 Agents)",
      status: "Running",
      scenario_prompt: body.scenarioPrompt || "Default scenario parameters",
      questions: body.questions || [],
      cost_credits: 100,
    });

    await newSim.save();

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
