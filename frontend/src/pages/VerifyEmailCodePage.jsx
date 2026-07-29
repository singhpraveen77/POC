import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, sendVerificationCode } from "../redux/auth/authThunk.js";
import { clearError } from "../redux/auth/authSlice.js";
import Button from "../components/common/Button.jsx";
import { extractFieldErrors } from "../utils/errorHelper.js";
import toast from "react-hot-toast";

export default function VerifyEmailCodePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const email = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (!email) {
      toast.error("No email provided for verification.");
      navigate("/verify-email", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    dispatch(clearError());
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleOtpChange = (value, index) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setOtpError("");
    dispatch(clearError());
    if (value && index < 5) inputRefs[index + 1].current.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;
    setOtp(pasteData.split(""));
    inputRefs[5].current.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) { setOtpError("Please enter all 6 digits of the OTP code."); return; }
    try {
      await dispatch(verifyEmail({ email, otp: otpCode })).unwrap();
      toast.success("Email verified successfully! You can now log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      const fields = extractFieldErrors(err);
      if (fields.otp) { setOtpError(fields.otp); }
      else { setOtpError(typeof err === "string" ? err : "Verification failed"); }
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await dispatch(sendVerificationCode({ email })).unwrap();
      toast.success("A new verification code has been sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      setCooldown(60);
      if (inputRefs[0].current) inputRefs[0].current.focus();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-6">
          <h2 className="text-[24px] font-extrabold m-0 mb-2 text-[var(--color-on-surface)]">Enter Verification Code</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] m-0">
            We've sent a 6-digit code to <strong className="text-[var(--color-on-surface)]">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={[
                  "w-11 h-[46px] text-[20px] font-bold text-center border-[1.5px] rounded-[6px] outline-none bg-[var(--color-surface)] text-[var(--color-on-surface)] focus:border-[var(--color-border-focus)]",
                  otpError || error ? "border-[var(--color-error)]" : "border-[var(--color-outline)]"
                ].join(" ")}
              />
            ))}
          </div>

          {(otpError || error) && (
            <p className="text-[13px] text-[var(--color-error)] text-center font-semibold m-0">
              {otpError || error}
            </p>
          )}

          <Button type="submit" variant="solid" className="h-[42px] mt-3 justify-center font-bold" loading={loading}>
            Verify Code
          </Button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className={[
              "bg-transparent border-0 font-bold p-0 cursor-pointer",
              cooldown > 0 ? "text-[var(--color-outline)] cursor-not-allowed" : "text-[var(--color-primary)]"
            ].join(" ")}
          >
            {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend Code"}
          </button>
          <button
            onClick={() => navigate("/verify-email")}
            className="bg-transparent border-0 font-bold text-[var(--color-primary)] cursor-pointer p-0"
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
}