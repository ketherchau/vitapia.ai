import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  agent_id: string;
  version: number;
  demographics: {
    age: string;
    gender: string;
    income: string;
    housing: string;
    district: string;
    occupation: string;
    household_size: string;
  };
  memory_state: {
    completed_surveys: Array<{
      simulation_id: string;
      timestamp: Date;
      budget_breakdown: string;
      choice: string;
      reasoning: string;
    }>;
  };
  // Future-proofing for Phase 1 Vector memory
  embeddings?: number[];
  created_at: Date;
  updated_at: Date;
}

const AgentSchema: Schema = new Schema(
  {
    agent_id: { type: String, required: true, unique: true, index: true },
    version: { type: Number, default: 1 },
    demographics: {
      age: { type: String, required: true },
      gender: { type: String, required: true },
      income: { type: String, required: true },
      housing: { type: String, required: true },
      district: { type: String, required: true },
      occupation: { type: String, required: true },
      household_size: { type: String, required: true },
    },
    memory_state: {
      completed_surveys: [
        {
          simulation_id: { type: String },
          timestamp: { type: Date, default: Date.now },
          budget_breakdown: { type: String },
          choice: { type: String },
          reasoning: { type: String },
        }
      ]
    },
    embeddings: { type: [Number] }, // For Vector Search (Atlas)
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.models.Agent || mongoose.model<IAgent>("Agent", AgentSchema);
