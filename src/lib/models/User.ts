import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  user_id: string;
  email: string;
  name: string;
  organization?: string;
  api_key?: string;
  credits: number;
  plan: "Free" | "Starter" | "Professional" | "Enterprise";
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    organization: { type: String, default: "Vitapia HQ" },
    api_key: { type: String },
    credits: { type: Number, default: 200 }, // Default free credits
    plan: { type: String, enum: ["Free", "Starter", "Professional", "Enterprise"], default: "Free" },
    stripe_customer_id: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
