import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../redux/auth/authSlice";
import { login } from "../redux/auth/authThunk";
import AuthInput from "../components/auth/AuthInput";
import Button from "../components/common/Button";
import { extractFieldErrors } from "../utils/errorHelper";
import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateLoginFields = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateLoginFields()) return;

    try {
      await dispatch(
        login({
          email: email.trim(),
          password,
        })
      ).unwrap();

      toast.success("Successfully logged in!");
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      if (err === "Please verify your email first" || err === "Email registered but not verified") {
        toast.error("Please verify your email first.");
        navigate("/verify-email/code", { state: { email: email.trim() } });
      } else {
        const fields = extractFieldErrors(err);
        if (Object.keys(fields).length > 0) {
          setErrors(fields);
        } else {
          toast.error(typeof err === "string" ? err : "Invalid email or password");
        }
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--color-background)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-outline-variant)",
          borderRadius: "8px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          
          <h2
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: "800",
              color: "var(--color-on-surface)"
            }}
          >
            Sign In
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "var(--color-on-surface-variant)",
              fontSize: "14px",
            }}
          >
            Welcome back to Kanban Project
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <AuthInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="praveen@example.com"
            value={email}
            autoFocus
            error={errors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }}
          />

          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            error={errors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: "",
              }));
            }}
          />

          <Button
            variant="solid"
            type="submit"
            loading={loading}
            style={{ height: "42px", justifyContent: "center", fontWeight: 700 }}
          >
            Sign In
          </Button>
        </form>

        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              textDecoration: "none",
              fontWeight: "700",
              color: "var(--color-primary)",
            }}
          >
            Create Account
          </Link>
        </p>

        <p
          style={{
            marginTop: "12px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Already registered but not verified?{" "}
          <Link
            to="/verify-email"
            style={{
              textDecoration: "none",
              fontWeight: "700",
              color: "var(--color-primary)",
            }}
          >
            Verify Account
          </Link>
        </p>
      </div>
    </div>
  );
}