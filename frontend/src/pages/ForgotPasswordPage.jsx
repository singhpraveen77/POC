import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/auth/authThunk";
import { forgotPasswordSchema } from "../validators/auth.validators";
import AuthInput from "../components/auth/AuthInput";
import Button from "../components/common/Button";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse({ email: email.trim() });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError("");
    try {
      await dispatch(forgotPassword({ email: email.trim() })).unwrap();
      toast.success("OTP sent to your email");
      navigate("/reset-password/verify-otp", { state: { email: email.trim() } });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-7">
          <h2 className="m-0 text-[26px] font-extrabold text-[var(--color-on-surface)]">Forgot Password</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] text-sm">
            Enter your email and we'll send you an OTP to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            error={error}
            autoFocus
          />
          <Button variant="solid" type="submit" loading={loading} className="h-[42px] justify-center font-bold">
            Send OTP
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          Remembered your password?{" "}
          <Link to="/login" className="no-underline font-bold text-[var(--color-primary)]">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
