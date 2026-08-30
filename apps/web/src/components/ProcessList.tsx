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
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No processes yet</h3>
        <p className="text-[var(--color-text-secondary)]">Create your first process to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {processes.map((p) => (
        <div key={p.id} className="quiz-card">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg text-[var(--color-text)]">{p.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              p.status === 'active' 
                ? 'bg-[var(--color-success)] text-white' 
                : 'bg-[var(--color-text-secondary)] text-white'
            }`}>
              {p.status}
            </span>
          </div>
          
          <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
            {p.description || 'No description'}
          </p>
          
          <div className="flex items-center gap-2 mb-4 text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {p.lessonCount || 0} lessons
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => onEdit(p)} 
              className="btn text-sm px-3 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button 
              onClick={() => onLessons(p)} 
              className="btn text-sm px-3 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Lessons
            </button>
            <button 
              onClick={() => onAssign(p)} 
              className="btn btn-accent text-sm px-3 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Assign
            </button>
            <button 
              onClick={() => handleDelete(p.id)} 
              className="btn text-sm px-3 py-2 text-[var(--color-error)]"
            >
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
