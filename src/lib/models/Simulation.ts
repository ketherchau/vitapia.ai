import mongoose, { Schema, Document } from "mongoose";

export interface ISimulation extends Document {
  sim_id: string;
  user_id: string; // Foreign key
  name: string;
  audience_profile: string; // E.g. "HK Baseline (1000)"
  status: "Pending" | "Running" | "Completed" | "Failed";
  scenario_prompt: string;
  questions: Array<{
    q_id: string;
    text: string;
    options: string[];
  }>;
  results: {
    accuracy_score?: number;
    agent_responses: Array<{
      agent_id: string;
      q_id: string;
      choice: string;
      reasoning: string;
      budget_breakdown: string;
    }>;
  };
  cost_credits: number;
  created_at: Date;
  completed_at?: Date;
}

const SimulationSchema: Schema = new Schema(
  {
    sim_id: { type: String, required: true, unique: true, index: true },
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    audience_profile: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Running", "Completed", "Failed"], default: "Pending" },
    scenario_prompt: { type: String, required: true },
    questions: [
      {
        q_id: { type: String, required: true },
        text: { type: String, required: true },
        options: { type: [String], required: true },
      }
    ],
    results: {
      accuracy_score: { type: Number },
      agent_responses: [
        {
          agent_id: { type: String },
          q_id: { type: String },
          choice: { type: String },
          reasoning: { type: String },
          budget_breakdown: { type: String },
        }
      ]
    },
    cost_credits: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "completed_at" } }
);

export default mongoose.models.Simulation || mongoose.model<ISimulation>("Simulation", SimulationSchema);
