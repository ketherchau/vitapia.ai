import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  user_id: string;
  email: string;
  name: string;
  credits: number;
  plan: "Free" | "Pro" | "Enterprise";
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    credits: { type: Number, default: 200 }, // Default free credits
    plan: { type: String, enum: ["Free", "Pro", "Enterprise"], default: "Free" },
    stripe_customer_id: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
