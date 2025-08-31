import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  dob?: Date;
  provider: "email" | "google";
  otpHash?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    dob: { type: Date },
    provider: {
      type: String,
      enum: ["email", "google"],
      required: true,
      default: "email",
    },
    otpHash: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", schema);
