import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Simulation from '@/lib/models/Simulation';
import Agent from '@/lib/models/Agent';
import PDFDocument from 'pdfkit';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    
    const sim = await Simulation.findOne({ sim_id: params.id }).lean();
    if (!sim) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
    }

    if (sim.status !== "Completed") {
      return NextResponse.json({ error: "Simulation is not yet completed" }, { status: 400 });
    }

    // Populate agent details
    const agentIds = sim.results?.agent_responses?.map((r: { agent_id: string }) => r.agent_id) || [];
    const agents = await Agent.find({ agent_id: { $in: agentIds } }).lean();
    
    const agentMap = agents.reduce((acc: Record<string, Record<string, string>>, agent: { agent_id: string; demographics: Record<string, string> }) => {
      acc[agent.agent_id] = agent.demographics;
      return acc;
    }, {});

    const enrichedResponses = sim.results?.agent_responses?.map((r: { agent_id: string, choice: string, reasoning: string, q_id?: string }) => ({
      ...r,
      demographics: agentMap[r.agent_id]
    })) || [];

    // Calculate metrics based on the first question to avoid double counting agents
    const currentQId = (sim.questions as Array<Record<string, unknown>>)?.[0]?.q_id;
    const filteredResponses = enrichedResponses.filter((r: { q_id?: string }) => !r.q_id || r.q_id === currentQId);

    const choiceCounts: Record<string, number> = {};
    filteredResponses.forEach((r: Record<string, unknown>) => {
      choiceCounts[String(r.choice)] = (choiceCounts[String(r.choice)] || 0) + 1;
    });
    
    let topChoice = "N/A";
    let topPct = "0.0%";
    if (filteredResponses.length > 0) {
      const sorted = Object.entries(choiceCounts).sort((a, b) => b[1] - a[1]);
      topChoice = sorted[0][0];
      topPct = ((sorted[0][1] / filteredResponses.length) * 100).toFixed(1) + "%";
    }

    // Create a PDF using PDFKit
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Title
      doc.fontSize(24).font('Helvetica-Bold').text(`Vitapia.ai Pulse Check Report`);
      doc.fontSize(14).font('Helvetica').fillColor('#666').text(`Simulation ID: ${sim.sim_id} | Status: ${sim.status}`).moveDown(1);
      
      // Meta
      doc.fontSize(12).fillColor('#000');
      doc.text(`Project Name: ${sim.name}`);
      doc.text(`Audience Profile: ${sim.audience_profile}`);
      doc.text(`Date Completed: ${new Date(sim.completed_at as string || Date.now()).toLocaleDateString()}`);
      doc.moveDown(1);

      // KPIs
      doc.fontSize(16).font('Helvetica-Bold').text('Executive Summary').moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(`Top Decision: ${topChoice} (${topPct})`);
      doc.text(`Total Responses: ${filteredResponses.length} Synthetic Agents`);
      doc.text(`Statistical Accuracy (MAE): ${sim.results?.accuracy_score ? Number(sim.results.accuracy_score).toFixed(1) + '%' : 'TBD'}`);
      doc.moveDown(1);

      // Scenario
      doc.fontSize(16).font('Helvetica-Bold').text('Scenario Prompt').moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(String(sim.scenario_prompt || "N/A"), { width: 500, align: 'left' }).moveDown(1);

      // Agent Voices
      doc.fontSize(16).font('Helvetica-Bold').text('Selected Agent Reasoning').moveDown(0.5);
      filteredResponses.slice(0, 10).forEach((voice: Record<string, unknown>) => {
        const d = voice.demographics as Record<string, string>;
        const demoStr = `${d?.age || 'Adult'}, ${d?.district || 'HK'}, ${d?.housing || 'Private'}`;
        
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#333').text(`Agent ${String(voice.agent_id)} [${demoStr}]`);
        doc.fontSize(10).font('Helvetica').fillColor('#000').text(`Choice: ${String(voice.choice)}`);
        doc.fontSize(10).font('Helvetica-Oblique').fillColor('#555').text(`Reasoning: "${String(voice.reasoning)}"`).moveDown(1);
      });

      doc.end();
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Vitapia_Report_${sim.sim_id}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
