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
      <div className="glass-card w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-2xl font-bold mb-4 shadow-lg">
            T
          </div>
          <h1 className="text-3xl font-bold text-white font-heading">TeachFlow</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
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
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
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
            <div className="p-3 rounded-lg bg-[rgba(248,113,113,0.2)] border border-[var(--color-error)] text-white text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-[var(--color-text-secondary)]">
          Don't have an account?{' '}
          <a href="/register" className="text-[var(--color-accent)] font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
