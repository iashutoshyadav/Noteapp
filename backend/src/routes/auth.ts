import { Router } from "express";
import {
  requestOtp,
  verifyOtpAndLogin,
  googleLogin
} from "../controllers/authController";

const router = Router();
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtpAndLogin);
router.post("/google", googleLogin);

export default router;
