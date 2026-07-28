import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { register } from '../redux/auth/authThunk'
import Button from '../components/common/Button.jsx'
import { extractFieldErrors, extractFieldErrorsRegister } from '../utils/errorHelper.js'
import toast from 'react-hot-toast'

import AuthInput from '../components/auth/AuthInput.jsx'
import { registerSchema } from '../validators/auth.validators.js.jsx'

export default function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [fields, setFields] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

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

        const result = registerSchema.safeParse(updatedFields);

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
    name: true,
    username: true,
    email: true,
    password: true,
    confirmPassword: true,
  });

  const result = registerSchema.safeParse(fields);

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
  setLoading(true);
    try {
      await dispatch(register({
        name: fields.name,
        username: fields.username,
        email: fields.email,
        password: fields.password
      })).unwrap()
      toast.success("Account created successfully! Please verify your email.")
      console.log("executed perfectly ");
      navigate('/verify-email/code', { replace: true, state: { email: fields.email } })
    } catch (err) {
      console.log("ERR:", err);
      console.log("FIELD ERRORS:", err?.errors?.fieldErrors);

      const fieldErrors = extractFieldErrorsRegister(err);
      console.log("EXTRACTED:", fieldErrors);
      if (Object.keys(fieldErrors).length > 0) {
        console.log("Setting errors...");
        setErrors(fieldErrors)
        console.log("Setted  errors...",fieldErrors);
      } else {
        console.log("error else block ")
        toast.error(typeof err === "string" ? err : "Registration failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[var(--color-background)] p-6">
      <div className="w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-6">
          <h2 className="text-[26px] font-extrabold m-0 mb-2 text-[var(--color-on-surface)]">Create Account</h2>
        </div>

        <form onSubmit={(e)=>{handleSubmit(e)}} className="flex flex-col gap-4" noValidate>
          <AuthInput id="name" label="Full Name" placeholder="praveen singh ..." value={fields.name} onChange={update('name')} error={errors.name} autoFocus />
          <AuthInput id="username" label="Username" placeholder="praveen123 ..." value={fields.username} onChange={update('username')} error={errors.username} />
          <AuthInput id="email" label="Email Address" type="email" placeholder="praveen@example.com" value={fields.email} onChange={update('email')} error={errors.email} />
          <AuthInput id="password" label="Password" type="password" placeholder="••••••••" value={fields.password} onChange={update('password')} error={errors.password} />
          <AuthInput id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" value={fields.confirmPassword} onChange={update('confirmPassword')} error={errors.confirmPassword} />
          <Button type='submit' variant="solid" className="h-[42px] mt-3 justify-center font-bold" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[var(--color-primary)] no-underline">Sign in here</Link>
        </p>
      </div>
    </div>
  )
}
