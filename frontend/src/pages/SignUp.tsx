import { useEffect, useMemo, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import Alert from "../components/Alert";
import { api, setToken } from "../lib/api";
import { saveUser } from "../lib/auth";
import { Calendar } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    if (!id) return;
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
    if (!email) return undefined;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? undefined
      : "Enter a valid email.";
  }, [email]);

  async function getOtp() {
    try {
      setErr(undefined);
      if (!name.trim()) throw new Error("Name is required.");
      if (!dob.trim()) throw new Error("Date of Birth is required.");
      if (emailError) throw new Error(emailError);

      setLoading(true);
      await api.post("/auth/request-otp", { email });
      setOtpStep(true);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyAndSignup(e: React.FormEvent) {
    e.preventDefault();
    try {
      setErr(undefined);
      if (otp.trim().length !== 6) throw new Error("Enter the 6-digit OTP.");

      setLoading(true);
      const { data } = await api.post("/auth/verify-otp", {
        email,
        otp,
        name,
        dob,
      });
      setToken(data.token);
      saveUser(data.user);
      location.href = "/welcome";
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    // @ts-ignore
    const google = window.google;
    if (!google?.accounts?.id) return setErr("Google script not loaded.");
    if ((window as any)._googleSignInInProgress) return;
    (window as any)._googleSignInInProgress = true;

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
          setErr(
            e?.response?.data?.error || e?.message || "Google sign-in failed."
          );
        } finally {
          (window as any)._googleSignInInProgress = false;
        }
      },
    });

    google.accounts.id.prompt();
  }

  return (
    <AuthLayout title="Sign up">
      <Alert msg={err} />

      <form onSubmit={verifyAndSignup} className="space-y-4 font-sans">
        {/* Name */}
        <div className="relative">
          <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-black">
            Your Name
          </label>
          <input
            type="text"
            placeholder="your name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            className="w-full border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date of Birth */}
        <div className="relative">
          <label className="absolute -top-2 left-10 bg-white px-1 text-xs text-black">
            Date of Birth
          </label>
          <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.currentTarget.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">
              OTP
            </label>
            <input
              className="w-full border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.currentTarget.value)}
              maxLength={6}
              inputMode="numeric"
            />
          </div>
        )}

        {/* Buttons */}
        {!otpStep ? (
          <button
            type="button"
            className="btn bg-white hover:bg-gray-200 border border-gray-300 text-black w-full"
            onClick={getOtp}
            disabled={!!emailError || loading}
          >
            {loading ? "Sending…" : "Get OTP"}
          </button>
        ) : (
          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 text-white w-full"
            disabled={otp.trim().length !== 6 || loading}
          >
            {loading ? "Verifying…" : "Sign up"}
          </button>
        )}

        {/* Google button */}
        <button
          type="button"
          className="btn bg-blue-500 hover:bg-blue-600 text-white w-full"
          onClick={googleSignIn}
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-600 text-center">
          Already have an account?{" "}
          <a className="text-blue-600 underline" href="/signin">
            Sign in
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
