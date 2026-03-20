import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Simulation from '@/lib/models/Simulation';
import Agent from '@/lib/models/Agent'; // Ensure registered

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const sim = await Simulation.findOne({ sim_id: params.id }).lean();
    if (!sim) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
    }

    // Populate agent details
    const agentIds = sim.results?.agent_responses?.map((r: { agent_id: string }) => r.agent_id) || [];
    const agents = await Agent.find({ agent_id: { $in: agentIds } }).lean();
    
    const agentMap = agents.reduce((acc: Record<string, Record<string, string>>, agent: { agent_id: string; demographics: Record<string, string> }) => {
      acc[agent.agent_id] = agent.demographics;
      return acc;
    }, {});

    const enrichedResponses = sim.results?.agent_responses?.map((r: { agent_id: string }) => ({
      ...r,
      demographics: agentMap[r.agent_id]
    })) || [];

    return NextResponse.json({ 
      success: true, 
      simulation: {
        ...sim,
        results: {
          ...sim.results,
          agent_responses: enrichedResponses
        }
      }
    });

  } catch (error) {
    console.error("Simulation Detail Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
