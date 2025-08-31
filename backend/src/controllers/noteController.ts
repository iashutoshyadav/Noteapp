import { Response } from "express";
import { z } from "zod";
import { Note } from "../models/Note";
import { AuthedRequest } from "../middleware/auth";

const createSchema = z.object({ body: z.string().min(1).max(2000) });
const idSchema = z.object({ id: z.string().length(24) });

export const listNotes = async (req: AuthedRequest, res: Response) => {
  const notes = await Note.find({ user: req.user!.id }).sort({ createdAt: -1 });
  res.json({ notes });
};

export const createNote = async (req: AuthedRequest, res: Response) => {
  const { body } = createSchema.parse(req.body);
  const note = await Note.create({ user: req.user!.id, body });
  res.status(201).json({ note });
};

export const deleteNote = async (req: AuthedRequest, res: Response) => {
  const { id } = idSchema.parse(req.params);
  await Note.deleteOne({ _id: id, user: req.user!.id });
  res.json({ ok: true });
};
