import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/auth/authThunk";
import { resetPasswordSchema } from "../validators/auth.validators";
import AuthInput from "../components/auth/AuthInput";
import Button from "../components/common/Button";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { loading } = useSelector((s) => s.auth);

  const email = state?.email || "";
  const otp = state?.otp || "";

  const [fields, setFields] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  if (!email || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-on-surface-variant)]">
          Session expired.{" "}
          <Link to="/forgot-password" className="text-[var(--color-primary)] font-bold">Start over</Link>
        </p>
      </div>
    );
  }

  const update = (key) => (e) => {
    const updated = { ...fields, [key]: e.target.value };
    setFields(updated);
    const result = resetPasswordSchema.safeParse({ email, otp, ...updated });
    const errs = {};
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        if (!errs[issue.path[0]]) errs[issue.path[0]] = issue.message;
      });
    }
    setErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse({ email, otp, ...fields });
    if (!result.success) {
      const errs = {};
      result.error.issues.forEach((issue) => { if (!errs[issue.path[0]]) errs[issue.path[0]] = issue.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      await dispatch(resetPassword({ email, otp, newPassword: fields.newPassword, confirmPassword: fields.confirmPassword })).unwrap();
      toast.success("Password reset successfully! Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-7">
          <h2 className="m-0 text-[26px] font-extrabold text-[var(--color-on-surface)]">Set New Password</h2>
          <p className="mt-2 text-[var(--color-on-surface-variant)] text-sm">
            Create a strong password for <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <AuthInput
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={fields.newPassword}
            onChange={update("newPassword")}
            error={errors.newPassword}
            autoFocus
          />
          <AuthInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={fields.confirmPassword}
            onChange={update("confirmPassword")}
            error={errors.confirmPassword}
          />
          <Button variant="solid" type="submit" loading={loading} className="h-[42px] justify-center font-bold">
            Reset Password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="no-underline text-[var(--color-on-surface-variant)]">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
