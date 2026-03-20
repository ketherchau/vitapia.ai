import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/lib/models/Agent';

export async function GET() {
  try {
    await dbConnect();
    
    const totalAgents = await Agent.countDocuments();
    
    // If no agents are in DB, we'll return an empty state
    if (totalAgents === 0) {
      return NextResponse.json({
        success: true,
        totalAgents: 0,
        demographics: { age: [], gender: [], income: [], housing: [], district: [] }
      });
    }

    // Parallel aggregation for performance
    const [ageDist, genderDist, incomeDist, housingDist, districtDist] = await Promise.all([
      Agent.aggregate([{ $group: { _id: "$demographics.age", count: { $sum: 1 } } }]),
      Agent.aggregate([{ $group: { _id: "$demographics.gender", count: { $sum: 1 } } }]),
      Agent.aggregate([{ $group: { _id: "$demographics.income", count: { $sum: 1 } } }]),
      Agent.aggregate([{ $group: { _id: "$demographics.housing", count: { $sum: 1 } } }]),
      Agent.aggregate([{ $group: { _id: "$demographics.district", count: { $sum: 1 } } }])
    ]);

    const formatDist = (dist: Array<{ _id: string | null; count: number }>) => dist.map(d => ({ name: d._id || 'Unknown', value: d.count })).sort((a, b) => b.value - a.value);

    return NextResponse.json({
      success: true,
      totalAgents,
      demographics: {
        age: formatDist(ageDist),
        gender: formatDist(genderDist),
        income: formatDist(incomeDist),
        housing: formatDist(housingDist),
        district: formatDist(districtDist)
      }
    });

  } catch (error) {
    console.error("Agents Stats Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch agent statistics" }, { status: 500 });
  }
}
