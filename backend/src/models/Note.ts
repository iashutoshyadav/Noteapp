import { Schema, model, Types } from "mongoose";

export interface INote {
  _id: string;
  user: Types.ObjectId;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<INote>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    body: { type: String, required: true }
  },
  { timestamps: true }
);

export const Note = model<INote>("Note", schema);
