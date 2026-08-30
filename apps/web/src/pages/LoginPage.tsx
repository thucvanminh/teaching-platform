import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(identifier.trim(), password)
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] text-white text-2xl font-bold mb-4">
            T
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">TeachFlow</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Username or Email
            </label>
            <input
              type="text"
              placeholder="Enter your username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[var(--color-error)] text-white text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <a href="/register" className="text-[var(--color-primary)] font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
