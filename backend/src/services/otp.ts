import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function setOtp(email: string, otp: string) {
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await User.updateOne(
    { email },
    {
      $set: { otpHash, otpExpiresAt: expiresAt },
      $setOnInsert: { email, provider: "email" },
    },
    { upsert: true }
  );
}

export async function validateOtp(email: string, otp: string): Promise<boolean> {
  const user = await User.findOne({ email });
  if (!user || !user.otpHash || !user.otpExpiresAt) return false;

  const expiry = new Date(user.otpExpiresAt as any);
  if (isNaN(expiry.getTime()) || expiry.getTime() < Date.now()) return false;

  const hash = String(user.otpHash);

  const isMatch = await bcrypt.compare(otp, hash);
  if (!isMatch) return false;

  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return true;
}
