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
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)] text-white text-2xl font-bold mb-4">
            T
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Create Account</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Join TeachFlow today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Full Name
            </label>
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
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Username
            </label>
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
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Lowercase letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Email
            </label>
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
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="input"
              required
            />
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Minimum 6 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-4 rounded-xl text-center transition-all ${
                  role === 'student'
                    ? 'bg-[var(--color-primary)] text-white shadow-lg'
                    : 'bg-[var(--color-bg)] text-[var(--color-text)]'
                }`}
                style={role === 'student' ? {} : {
                  boxShadow: '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)'
                }}
              >
                <div className="text-2xl mb-1">📚</div>
                <div className="font-medium">Student</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-4 rounded-xl text-center transition-all ${
                  role === 'teacher'
                    ? 'bg-[var(--color-primary)] text-white shadow-lg'
                    : 'bg-[var(--color-bg)] text-[var(--color-text)]'
                }`}
                style={role === 'teacher' ? {} : {
                  boxShadow: '-4px -4px 10px var(--shadow-light), 4px 4px 10px var(--shadow-dark)'
                }}
              >
                <div className="text-2xl mb-1">👩‍🏫</div>
                <div className="font-medium">Teacher</div>
              </button>
            </div>
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
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <a href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}
