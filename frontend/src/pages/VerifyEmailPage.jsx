import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendVerificationCode } from "../redux/auth/authThunk";
import { clearError } from "../redux/auth/authSlice";
import AuthInput from "../components/auth/AuthInput";
import Button from "../components/common/Button";
import { extractFieldErrors } from "../utils/errorHelper";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }

    try {
      await dispatch(
        sendVerificationCode({
          email: email.trim(),
        })
      ).unwrap();

      toast.success("Verification code sent successfully!");
      navigate("/verify-email/code", { state: { email: email.trim() } });
    } catch (err) {
      console.error(err);
      const fields = extractFieldErrors(err);
      if (fields.email) {
        setEmailError(fields.email);
      } else {
        setEmailError(typeof err === "string" ? err : "Failed to send verification code");
      }
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
          maxWidth: "420px",
          padding: "40px",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-outline-variant)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 8,
            backgroundColor: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.25)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#fff' }}>mail</span>
          </div>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "800",
              margin: "0 0 8px 0",
              color: "var(--color-on-surface)",
            }}
          >
            Verify Email
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-on-surface-variant)",
              margin: 0,
            }}
          >
            Enter your email to receive a 6-digit verification code.
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
            error={emailError || error}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              dispatch(clearError());
            }}
            autoFocus
          />

          <Button
            type="submit"
            variant="solid"
            style={{ height: "42px", marginTop: "12px", justifyContent: "center", fontWeight: 700 }}
            loading={loading}
          >
            Send Verification Code
          </Button>
        </form>

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
              fontWeight: "700",
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
