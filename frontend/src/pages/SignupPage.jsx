import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { register } from '../redux/auth/authThunk'
import Button from '../components/common/Button'
import { extractFieldErrors, extractFieldErrorsRegister } from '../utils/errorHelper'
import toast from 'react-hot-toast'

import AuthInput from '../components/auth/AuthInput'
import { registerSchema } from '../validators/auth.validators'

export default function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [fields, setFields] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function update(key) {
    return (e) => {
      setFields(prev => ({ ...prev, [key]: e.target.value }))
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({});
    console.log(" this is the handle submit called ")

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

    setLoading(true)
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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '40px', 
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-outline-variant)',
        borderRadius: '8px',
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          
          <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--color-on-surface)' }}>
            Create Account
          </h2>
          
        </div>

        <form onSubmit={(e)=>{handleSubmit(e)}} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
          <AuthInput
            id="name"
            label="Full Name"
            placeholder="praveen singh ..."
            value={fields.name}
            onChange={update('name')}
            error={errors.name}
            autoFocus
          />
          <AuthInput
            id="username"
            label="Username"
            placeholder="praveen123 ..."
            value={fields.username}
            onChange={update('username')}
            error={errors.username}
          />
          <AuthInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="praveen@example.com"
            value={fields.email}
            onChange={update('email')}
            error={errors.email}
          />
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={fields.password}
            onChange={update('password')}
            error={errors.password}
          />
          <AuthInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={fields.confirmPassword}
            onChange={update('confirmPassword')}
            error={errors.confirmPassword}
          />

          <Button
            type='submit'
            variant="solid"
            style={{ height: '42px', marginTop: '12px', justifyContent: 'center', fontWeight: 700 }}
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '700', color: 'var(--color-primary)', textDecoration: 'none' }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
