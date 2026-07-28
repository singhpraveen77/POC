import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendVerificationCode } from "../redux/auth/authThunk.js";
import { clearError } from "../redux/auth/authSlice.js";
import AuthInput from "../components/auth/AuthInput.jsx";
import Button from "../components/common/Button.jsx";
import { extractFieldErrors } from "../utils/errorHelperjs";
import toast from "react-hot-toast";

export default function jsVerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    dispatch(clearError());
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!email.trim()) { setEmailError("Email is required"); return; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) { setEmailError("Enter a valid email address"); return; }
    try {
      await dispatch(sendVerificationCode({ email: email.trim() })).unwrap();
      toast.success("Verification code sent successfully!");
      navigate("/verify-email/code", { state: { email: email.trim() } });
    } catch (err) {
      const fields = extractFieldErrors(err);
      if (fields.email) { setEmailError(fields.email); }
      else { setEmailError(typeof err === "string" ? err : "Failed to send verification code"); }
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-6">
          <h2 className="text-[26px] font-extrabold m-0 mb-2 text-[var(--color-on-surface)]">Verify Email</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] m-0">
            Enter your email to receive a 6-digit verification code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <AuthInput
            id="email" label="Email Address" type="email" placeholder="name@example.com"
            value={email} error={emailError || error}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); dispatch(clearError()); }}
            autoFocus
          />
          <Button type="submit" variant="solid" className="h-[42px] mt-3 justify-center font-bold" loading={loading}>
            Send Verification Code
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          Back to{" "}
          <Link to="/login" className="font-bold text-[var(--color-primary)] no-underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
