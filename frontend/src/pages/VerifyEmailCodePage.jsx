import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, sendVerificationCode } from "../redux/auth/authThunk";
import { clearError } from "../redux/auth/authSlice";
import Button from "../components/common/Button";
import { extractFieldErrors } from "../utils/errorHelper";
import toast from "react-hot-toast";

export default function VerifyEmailCodePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.auth);
  
  const email = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  
  // 60-second cooldown for Resend Code
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Redirect if no email is present in state
  useEffect(() => {
    if (!email) {
      toast.error("No email provided for verification.");
      navigate("/verify-email", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple characters are somehow inputted
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setOtpError("");
    dispatch(clearError());

    // Focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Clear previous input and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    inputRefs[5].current.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setOtpError("Please enter all 6 digits of the OTP code.");
      return;
    }

    try {
      await dispatch(
        verifyEmail({
          email,
          otp: otpCode,
        })
      ).unwrap();

      toast.success("Email verified successfully! You can now log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      const fields = extractFieldErrors(err);
      if (fields.otp) {
        setOtpError(fields.otp);
      } else {
        setOtpError(typeof err === "string" ? err : "Verification failed");
      }
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      await dispatch(
        sendVerificationCode({
          email,
        })
      ).unwrap();

      toast.success("A new verification code has been sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      setCooldown(60); // Trigger 60-second cooldown
      if (inputRefs[0].current) inputRefs[0].current.focus();
    } catch (err) {
      console.error(err);
      toast.error(typeof err === "string" ? err : "Failed to resend code");
    }
  };

  const handleChangeEmail = () => {
    navigate("/verify-email");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "var(--color-background)",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-outline-variant)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              margin: "0 0 8px 0",
              color: "var(--color-on-surface)",
            }}
          >
            Enter Verification Code
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-on-surface-variant)",
              margin: 0,
            }}
          >
            We've sent a 6-digit code to <strong style={{ color: "var(--color-on-surface)" }}>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }} onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                style={{
                  width: "44px",
                  height: "46px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: "1.5px solid",
                  borderColor: otpError || error ? "var(--color-error)" : "var(--color-outline)",
                  borderRadius: "6px",
                  outline: "none",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-on-surface)",
                }}
                className="focus:border-orange-500"
              />
            ))}
          </div>

          {(otpError || error) && (
            <p style={{ fontSize: "13px", color: "var(--color-error)", margin: "0 auto", textAlign: "center", fontWeight: 600 }}>
              {otpError || error}
            </p>
          )}

          <Button
            type="submit"
            variant="solid"
            style={{ height: "42px", marginTop: "12px", justifyContent: "center", fontWeight: 700 }}
            loading={loading}
          >
            Verify Code
          </Button>
        </form>

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            style={{
              background: "none",
              border: "none",
              fontWeight: "700",
              color: cooldown > 0 ? "var(--color-outline)" : "var(--color-primary)",
              cursor: cooldown > 0 ? "not-allowed" : "pointer",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend Code"}
          </button>

          <button
            onClick={handleChangeEmail}
            style={{
              background: "none",
              border: "none",
              fontWeight: "700",
              color: "var(--color-primary)",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
}
