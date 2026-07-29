import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../redux/auth/authSlice.js";
import { login } from "../redux/auth/authThunk.js";
import AuthInput from "../components/auth/AuthInput.jsx";
import Button from "../components/common/Button.jsx";
import { extractFieldErrors } from "../utils/errorHelper.js";
import toast from "react-hot-toast";
import { loginSchema } from "../validators/auth.validators.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [fields, setFields] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  function update(key) {
    return (e) => {
      const value = e.target.value;
      setTouched((prevTouched) => {
        const newTouched = { ...prevTouched, [key]: true };
        setFields((prevFields) => {
          const updatedFields = { ...prevFields, [key]: value };
          const result = loginSchema.safeParse(updatedFields);
          const validationErrors = {};
          if (!result.success) {
            result.error.issues.forEach((issue) => {
              const field = issue.path[0];
              if (newTouched[field] && !validationErrors[field]) {
                validationErrors[field] = issue.message;
              }
            });
          }
          setErrors(validationErrors);
          return updatedFields;
        });
        return newTouched;
      });
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const result = loginSchema.safeParse(fields);
    if (!result.success) {
      const validationErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!validationErrors[field]) validationErrors[field] = issue.message;
      });
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await dispatch(login({ email: fields.email.trim(), password: fields.password })).unwrap();
      toast.success("Successfully logged in!");
      navigate("/", { replace: true });
    } catch (err) {
      if (err === "Please verify your email first" || err === "Email registered but not verified") {
        toast.error("Please verify your email first.");
        navigate("/verify-email", { state: { email: fields.email.trim() } });
      } else {
        const fieldErrors = extractFieldErrors(err);
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          toast.error(typeof err === "string" ? err : "Invalid email or password");
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-7">
          <h2 className="m-0 text-[26px] font-extrabold text-[var(--color-on-surface)]">Sign In</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] text-sm">Welcome back to Kanban Project</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <AuthInput id="email" label="Email" value={fields.email} onChange={update("email")} error={errors.email} />
          <AuthInput id="password" type="password" label="Password" value={fields.password} onChange={update("password")} error={errors.password} />
          <Button variant="solid" type="submit" loading={loading} className="h-[42px] justify-center font-bold">
            Sign In
          </Button>
          <p className="text-right m-0 text-[13px]">
            <Link to="/forgot-password" className="no-underline text-[var(--color-primary)] font-semibold">
              Forgot password?
            </Link>
          </p>
        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="no-underline font-bold text-[var(--color-primary)]">Create Account</Link>
        </p>
        <p className="mt-3 text-center text-sm">
          Already registered but not verified?{" "}
          <Link to="/verify-email" className="no-underline font-bold text-[var(--color-primary)]">Verify Account</Link>
        </p>
      </div>
    </div>
  );
}