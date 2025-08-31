import jwt, { type Secret, type SignOptions, type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

function toExpiresIn(v: string): SignOptions["expiresIn"] {
  if (/^\d+$/.test(v)) return Number(v);
  return v as unknown as SignOptions["expiresIn"];
}

export function signJwt(payload: object): string {
  const secret: Secret = env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: toExpiresIn(env.JWT_EXPIRES)
  };
  return jwt.sign(payload, secret, options);
}

export function verifyJwt<T = JwtPayload>(token: string): T {
  const secret: Secret = env.JWT_SECRET as string;
  return jwt.verify(token, secret) as T;
}
