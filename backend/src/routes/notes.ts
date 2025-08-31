import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listNotes, createNote, deleteNote } from "../controllers/noteController";

const router = Router();

router.use(requireAuth);
router.get("/", listNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);

export default router;
