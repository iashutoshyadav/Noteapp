import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { generateOtp, setOtp, validateOtp } from "../services/otp.js";
import { signJwt } from "../services/jwt.js";
import { verifyGoogleIdToken } from "../services/google.js";
import nodemailer from "nodemailer";

// Schemas
const emailSchema = z.object({ email: z.string().email() });
const otpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  name: z.string().min(1).optional(),
  dob: z.string().optional(),
});
const googleSchema = z.object({ idToken: z.string().min(10) });

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const requestOtp = async (req: Request, res: Response) => {
  const { email } = emailSchema.parse(req.body);
  const otp = generateOtp();
  await setOtp(email, otp);

  try {
    await transporter.sendMail({
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: `<h2>Your OTP is ${otp}</h2><p>It is valid for 10 minutes.</p>`,
    });

    return res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Email sending failed:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOtpAndLogin = async (req: Request, res: Response) => {
  const { email, otp, name, dob } = otpVerifySchema.parse(req.body);
  const ok = await validateOtp(email, otp);
  if (!ok) return res.status(400).json({ error: "Invalid or expired OTP" });

  const dobDate = dob ? new Date(dob) : undefined;

  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, provider: "email", name, dob: dobDate } },
    { new: true, upsert: true }
  );

  const token = signJwt({ id: user.id, email: user.email });
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      dob: user.dob,
      provider: user.provider,
    },
  });
};

export const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = googleSchema.parse(req.body);
  const { email, name } = await verifyGoogleIdToken(idToken);

  const user = await User.findOneAndUpdate(
    { email },
    { $set: { provider: "google", name } },
    { new: true, upsert: true }
  );

  const token = signJwt({ id: user.id, email: user.email });
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    },
  });
};
