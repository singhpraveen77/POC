import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyResetOtp, forgotPassword } from "../redux/auth/authThunk.js";
import { verifyResetOtpSchema } from "../validators/auth.validators.js";
import AuthInput from "../components/auth/AuthInput.jsx";
import Button from "../components/common/Button.jsx";
import toast from "react-hot-toast";
export default function ResetOtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { loading } = useSelector((s) => s.auth);
  const email = state?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = verifyResetOtpSchema.safeParse({ email, otp });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError("");
    try {
      await dispatch(verifyResetOtp({ email, otp })).unwrap();
      toast.success("OTP verified");
      navigate("/reset-password/new", { state: { email, otp } });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Invalid or expired OTP");
    }
  };
  const handleResend = async () => {
    setResending(true);
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      toast.success("New OTP sent to your email");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-on-surface-variant)]">
          No email provided.{" "}
          <Link to="/forgot-password" className="text-[var(--color-primary)] font-bold">Go back</Link>
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-7">
          <h2 className="m-0 text-[26px] font-extrabold text-[var(--color-on-surface)]">Enter OTP</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] text-sm">
            We sent a 6-digit OTP to <strong>{email}</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <AuthInput
            id="otp"
            label="OTP Code"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
            error={error}
            autoFocus
          />
          <Button variant="solid" type="submit" loading={loading} className="h-[42px] justify-center font-bold">
            Verify OTP
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-[var(--color-on-surface-variant)]">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="bg-transparent border-0 cursor-pointer font-bold text-[var(--color-primary)] text-sm"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/forgot-password" className="no-underline text-[var(--color-on-surface-variant)]">
            ← Use a different email
          </Link>
        </p>
      </div>
    </div>
  );
}