import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [selectedProcess, setSelectedProcess] = useState<any>(null)

  useEffect(() => {
    api.get('/api/student-processes').then(({ data }) => setAssignments(data))
  }, [])

  const viewLessons = async (processId: string) => {
    const { data } = await api.get(`/api/processes/${processId}`)
    setSelectedProcess(data)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="card !rounded-none border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--color-text)]">My Learning</h1>
              <p className="text-xs text-[var(--color-text-secondary)]">Welcome back, {user?.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-text-secondary)] hidden sm:block">{user?.fullName}</span>
            <button onClick={signOut} className="btn text-sm px-3 py-2 text-[var(--color-error)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {selectedProcess ? (
          <div>
            {/* Back button */}
            <button 
              onClick={() => setSelectedProcess(null)} 
              className="btn text-sm mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to processes
            </button>

            {/* Process Header */}
            <div className="card mb-6">
              <h2 className="text-xl font-bold text-[var(--color-text)]">{selectedProcess.title}</h2>
              {selectedProcess.description && (
                <p className="text-[var(--color-text-secondary)] mt-2">{selectedProcess.description}</p>
              )}
            </div>

            {/* Lessons List */}
            <div className="space-y-3">
              {selectedProcess.lessons?.sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((l: any, idx: number) => (
                <div key={l.id} className="quiz-card">
                  <div className="flex items-start gap-4">
                    <div className="question-number flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-[var(--color-text)]">{l.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
                          style={{
                            boxShadow: 'inset -2px -2px 5px var(--shadow-light), inset 2px 2px 5px var(--shadow-dark)'
                          }}>
                          {l.lessonType}
                        </span>
                      </div>
                      {l.description && (
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{l.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        {l.contentUrl && (
                          <a 
                            href={l.contentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn text-sm px-3 py-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open material
                          </a>
                        )}
                        {l.lessonType === 'quiz' && (
                          <button 
                            onClick={() => navigate(`/quiz/${l.id}`)}
                            className="btn btn-primary text-sm px-3 py-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Start Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No courses assigned yet</h3>
                <p className="text-[var(--color-text-secondary)]">Wait for your teacher to assign a course to you.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((a) => (
                  <div key={a.id} className="quiz-card">
                    <h3 className="font-semibold text-lg text-[var(--color-text)] mb-2">{a.processTitle}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                      Assigned {new Date(a.assignedAt).toLocaleDateString()}
                    </p>
                    <button 
                      onClick={() => viewLessons(a.processId)}
                      className="btn btn-primary w-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Lessons
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
