import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, verifyUser } from "../redux/auth/authThunk";
import { clearError, clearMessage } from "../redux/auth/authSlice";
import { addToast } from "../redux/toast/toastSlice";
import AuthInput from "../components/auth/AuthInput";

export default function VerifyOtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, message } = useSelector((state) => state.auth);

  // Retrieve email from signup page navigation state or fall back
  const signupEmail = location.state?.email || "";
  const [email, setEmail] = useState(signupEmail);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    // Clean up error and messages when component mounts/unmounts
    dispatch(clearError());
    dispatch(clearMessage());
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const validateFields = () => {
    let isValid = true;
    if (!email.trim()) {
      dispatch(addToast({ message: "Email is required", type: "error" }));
      isValid = false;
    }
    if (!otp.trim()) {
      setOtpError("OTP is required");
      isValid = false;
    } else if (otp.trim().length !== 4) {
      setOtpError("OTP must be 4 digits");
      isValid = false;
    } else if (!/^\d+$/.test(otp.trim())) {
      setOtpError("OTP must contain only numbers");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await dispatch(
        verifyOtp({
          email: email.trim(),
          otp: otp.trim(),
        })
      ).unwrap();

      dispatch(
        addToast({
          message: "Verification successful! You can now log in.",
          type: "success",
        })
      );
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      dispatch(addToast({ message: "Please enter an email first", type: "error" }));
      return;
    }

    setResending(true);
    try {
      await dispatch(
        verifyUser({
          email: email.trim(),
        })
      ).unwrap();

      dispatch(
        addToast({
          message: "A new OTP has been sent to your email.",
          type: "success",
        })
      );
      setOtp("");
    } catch (err) {
      console.error(err);
    } finally {
      setResending(false);
    }
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
          maxWidth: "400px",
          padding: "32px",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-outline-variant)",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 8px 0",
              color: "var(--color-on-surface)",
            }}
          >
            Verify Account
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-on-surface-variant)",
              margin: 0,
            }}
          >
            Enter the 4-digit verification code sent to your email
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          noValidate
        >
          <AuthInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            id="otp"
            label="Verification Code (OTP)"
            type="text"
            placeholder="e.g. 1234"
            maxLength={4}
            value={otp}
            error={otpError || error}
            onChange={(e) => {
              setOtp(e.target.value);
              setOtpError("");
              dispatch(clearError());
            }}
            autoFocus
          />

          <button
            type="submit"
            className="btn btn-solid w-full"
            style={{ height: "40px", marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px" }}>
          <button
            onClick={handleResend}
            disabled={resending || loading}
            style={{
              background: "none",
              border: "none",
              fontWeight: "bold",
              color: "var(--color-primary)",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </div>

        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px",
            color: "var(--color-on-surface-variant)",
          }}
        >
          Back to{" "}
          <Link
            to="/login"
            style={{
              fontWeight: "bold",
              color: "var(--color-primary)",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
