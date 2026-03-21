import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/forms/Button'
import { TextInput } from '../components/forms/TextInput'
import ErrorAlert from '../components/ErrorAlert'
import Spinner from '../components/Spinner'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login({ email, password })
      navigate(from === '/login' ? '/' : from)
    } catch (err) {
      setError(err?.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Login
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in to manage blog posts and gallery items.
        </p>

        {error ? <div className="mt-4"><ErrorAlert message={error} /></div> : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <Button type="submit" disabled={submitting} variant="primary">
            {submitting ? <Spinner inline label="Signing in..." /> : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}

