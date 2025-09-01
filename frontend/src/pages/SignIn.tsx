import { useEffect, useMemo, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import Alert from "../components/Alert";
import { api, setToken } from "../lib/api";
import { saveUser } from "../lib/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState<string>();
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return;
    if (!document.getElementById("gsi")) {
      const s = document.createElement("script");
      s.id = "gsi";
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }
  }, []);

  const emailError = useMemo(() => {
    if (!email) return;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? undefined
      : "Enter a valid email.";
  }, [email]);

  async function requestOtp() {
    try {
      setErr(undefined);
      setLoading(true);
      if (emailError) throw new Error(emailError);

      await api.post("/auth/request-otp", { email });
      setOtpStep(true);
    } catch (e: any) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    try {
      setErr(undefined);
      setLoading(true);
      if (otp.length !== 6) throw new Error("Enter the 6-digit OTP.");

      const { data } = await api.post("/auth/verify-otp", { email, otp });
      setToken(data.token);
      saveUser(data.user);
      location.href = "/welcome";
    } catch (e: any) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    // @ts-ignore
    const google = window.google;
    if (!google) return setErr("Google script not loaded.");
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (resp: any) => {
        try {
          const { data } = await api.post("/auth/google", {
            idToken: resp.credential,
          });
          setToken(data.token);
          saveUser(data.user);
          location.href = "/welcome";
        } catch (e: any) {
          setErr(e.response?.data?.error || e.message);
        }
      },
    });
    google.accounts.id.prompt();
  }

  return (
    <AuthLayout title="Sign in">
      <Alert msg={err} />

      <div className="space-y-4">
        {/* Email */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-black">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className="w-full border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && (
            <p className="text-xs text-red-500 mt-1">{emailError}</p>
          )}
        </div>

        {/* OTP */}
        {otpStep && (
          <FormField
            label="OTP"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.currentTarget.value)}
          />
        )}

        {/* Buttons */}
        {!otpStep ? (
          <button
            className="btn bg-white hover:bg-gray-200 border border-gray-300 text-black w-full"
            onClick={requestOtp}
            disabled={!!emailError || loading}
          >
            {loading ? "Sending..." : "Get OTP"}
          </button>
        ) : (
          <button
            className="btn bg-blue-600 hover:bg-blue-700 text-white w-full"
            onClick={verifyOtp}
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        )}

        {/* Google */}
        <button
          className="btn bg-blue-400 hover:bg-blue-500 text-white w-full"
          onClick={googleSignIn}
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-600 text-center">
          New here?{" "}
          <a className="text-blue-600 underline" href="/signup">
            Create account
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
