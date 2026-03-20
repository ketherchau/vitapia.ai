import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Simulation from '@/lib/models/Simulation';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Hardcoded auth fallback for MVP Pitch
    const user_id = "admin_hikari";
    
    // Parallel fetch of user doc and their simulations
    const [user, simulations] = await Promise.all([
      User.findOne({ user_id }).lean(),
      Simulation.find({ user_id }).lean()
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalSimulations = simulations.length;
    let agentsSpawned = 0;
    let totalProcessingTime = 0;
    let completedCount = 0;

    for (const sim of simulations as Record<string, unknown>[]) {
      // Calculate Agents Spawned
      const results = sim.results as Record<string, unknown>;
      const responsesCount = Array.isArray(results?.agent_responses) ? results.agent_responses.length : 0;
      if (responsesCount > 0) {
        agentsSpawned += responsesCount;
      } else {
        const profile = String(sim.audience_profile || "");
        const match = profile.match(/\(([\d,]+)\sAgents\)/);
        if (match && match[1]) {
          agentsSpawned += parseInt(match[1].replace(/,/g, ''), 10);
        }
      }

      // Calculate Turnaround Time (Completed minus Created)
      if (sim.status === "Completed" && sim.completed_at && sim.created_at) {
        const durationSeconds = (new Date(sim.completed_at as string).getTime() - new Date(sim.created_at as string).getTime()) / 1000;
        if (durationSeconds > 0) {
          totalProcessingTime += durationSeconds;
          completedCount++;
        }
      }
    }

    const avgTurnaround = completedCount > 0 ? Math.round(totalProcessingTime / completedCount) : 0;

    return NextResponse.json({ 
      success: true, 
      stats: {
        totalSimulations,
        agentsSpawned,
        avgTurnaroundSeconds: avgTurnaround,
        credits: user.credits || 0,
        plan: user.plan || "Free"
      }
    });

  } catch (error) {
    console.error("User Stats Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 });
  }
}
