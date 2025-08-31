import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../services/jwt.js";

export interface AuthedRequest extends Request {
  user?: { id: string; email: string };
}

export function requireAuth(
  req: AuthedRequest, res: Response, next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = verifyJwt<{ id: string; email: string }>(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid/expired token" });
  }
}
