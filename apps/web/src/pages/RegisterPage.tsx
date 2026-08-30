import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signUp(email.trim(), username.trim().toLowerCase(), password, fullName.trim(), role)
      window.location.href = '/login'
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-2xl font-bold mb-4 shadow-[0_0_24px_var(--color-primary-glow)] border border-white/40">
            T
          </div>
          <h1 className="text-3xl font-bold text-white font-heading">Create Account</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Join TeachFlow today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              minLength={3}
              pattern="[a-z0-9_]+"
              className="input"
              required
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Lowercase letters, numbers, and underscores only</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="input"
              required
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-4 rounded-xl text-center transition-all ${
                  role === 'student'
                    ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_0_20px_var(--color-primary-glow)] border border-white/50'
                    : 'glass-card text-white hover:border-white/30'
                }`}
              >
                <div className="text-2xl mb-1">📚</div>
                <div className="font-medium">Student</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-4 rounded-xl text-center transition-all ${
                  role === 'teacher'
                    ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_0_20px_var(--color-primary-glow)] border border-white/50'
                    : 'glass-card text-white hover:border-white/30'
                }`}
              >
                <div className="text-2xl mb-1">👩‍🏫</div>
                <div className="font-medium">Teacher</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[rgba(248,113,113,0.15)] border border-[var(--color-error)] text-white text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <a href="/login" className="text-[var(--color-accent)] font-medium hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}
