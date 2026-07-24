import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../redux/auth/authSlice";
import { login } from "../redux/auth/authThunk";
import AuthInput from "../components/auth/AuthInput";
import Button from "../components/common/Button";
import { extractFieldErrors } from "../utils/errorHelper";
import toast from "react-hot-toast";
import { loginSchema } from "../validators/auth.validators";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [fields, setFields] = useState({
  email: "",
  password: "",
});

const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});


  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  function update(key) {
  return (e) => {
    const value = e.target.value;

    setTouched((prevTouched) => {
      const newTouched = {
        ...prevTouched,
        [key]: true,
      };

      setFields((prevFields) => {
        const updatedFields = {
          ...prevFields,
          [key]: value,
        };

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

  setTouched({
    email: true,
    password: true,
  });

  const result = loginSchema.safeParse(fields);

  if (!result.success) {
    const validationErrors = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0];

      if (!validationErrors[field]) {
        validationErrors[field] = issue.message;
      }
    });

    setErrors(validationErrors);
    return;
  }

  setErrors({});

  try {
    await dispatch(
      login({
        email: fields.email.trim(),
        password: fields.password,
      })
    ).unwrap();

    toast.success("Successfully logged in!");
    navigate("/", { replace: true });
  } catch (err) {
    if (
      err === "Please verify your email first" ||
      err === "Email registered but not verified"
    ) {
      toast.error("Please verify your email first.");
      navigate("/verify-email", {
        state: { email: fields.email.trim() },
      });
    } else {
      const fieldErrors = extractFieldErrors(err);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        toast.error(
          typeof err === "string"
            ? err
            : "Invalid email or password"
        );
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
          onSubmit={(e)=>{handleSubmit(e)}}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <AuthInput
            id="email"
            label="Email"
            value={fields.email}
            onChange={update("email")}
            error={errors.email}
          />

          <AuthInput
            id="password"
            type="password"
            label="Password"
            value={fields.password}
            onChange={update("password")}
            error={errors.password}
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