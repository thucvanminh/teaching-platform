import api from '../lib/api'

interface Props {
  processes: any[]
  onEdit: (p: any) => void
  onLessons: (p: any) => void
  onAssign: (p: any) => void
  onDelete: () => void
}

export default function ProcessList({ processes, onEdit, onLessons, onAssign, onDelete }: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this process?')) return
    await api.delete(`/api/processes/${id}`)
    onDelete()
  }

  if (processes.length === 0) {
    return (
      <div className="text-center py-16 px-4 glass-card max-w-md mx-auto animate-fade-in shadow-lg">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-white font-heading mb-2">No processes yet</h3>
        <p className="text-sm text-[var(--color-text-secondary)]">Create your first process to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {processes.map((p, idx) => (
        <div key={p.id} className="quiz-card animate-fade-in flex flex-col justify-between" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-bold text-lg text-white font-heading">{p.title}</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                p.status === 'active' 
                  ? 'bg-[var(--color-success)] text-white shadow-[0_0_10px_var(--color-success-glow)]' 
                  : 'bg-[rgba(255,255,255,0.15)] text-white'
              }`}>
                {p.status}
              </span>
            </div>
            
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
              {p.description || 'No description provided'}
            </p>
            
            <div className="flex items-center gap-2 mb-4 text-xs text-[var(--color-text-muted)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{p.lessonCount || 0} lessons</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--glass-border-subtle)]">
            <button onClick={() => onEdit(p)} className="btn btn-secondary text-xs sm:text-sm px-3 py-2 flex-1 justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button onClick={() => onLessons(p)} className="btn btn-secondary text-xs sm:text-sm px-3 py-2 flex-1 justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Lessons
            </button>
            <button onClick={() => onAssign(p)} className="btn btn-accent text-xs sm:text-sm px-3 py-2 flex-1 justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Assign
            </button>
            <button onClick={() => handleDelete(p.id)} className="btn btn-ghost text-xs sm:text-sm px-2.5 py-2 text-[var(--color-error)] hover:bg-[rgba(248,113,113,0.15)] rounded-xl" title="Delete">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
