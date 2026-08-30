import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import ProcessList from '../components/ProcessList'
import ProcessForm from '../components/ProcessForm'
import LessonManager from '../components/LessonManager'
import StudentAssignment from '../components/StudentAssignment'

export default function TeacherDashboard() {
  const { user, signOut } = useAuth()
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'lessons' | 'assign'>('list')
  const [processes, setProcesses] = useState<any[]>([])
  const [selectedProcess, setSelectedProcess] = useState<any>(null)

  const loadProcesses = async () => {
    const { data } = await api.get('/api/processes')
    setProcesses(data)
  }

  useEffect(() => { loadProcesses() }, [])

  const handleEdit = (process: any) => {
    setSelectedProcess(process)
    setView('edit')
  }

  const handleLessons = (process: any) => {
    setSelectedProcess(process)
    setView('lessons')
  }

  const handleAssign = (process: any) => {
    setSelectedProcess(process)
    setView('assign')
  }

  const handleSaved = () => {
    setView('list')
    setSelectedProcess(null)
    loadProcesses()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="card !rounded-none border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
              T
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--color-text)]">Teacher Dashboard</h1>
              <p className="text-xs text-[var(--color-text-secondary)]">Manage your courses</p>
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
        {/* Navigation Tabs */}
        <nav className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setView('list')} 
            className={`btn text-sm whitespace-nowrap ${
              view === 'list' ? 'btn-primary' : ''
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Processes
          </button>
          <button 
            onClick={() => { setSelectedProcess(null); setView('create') }} 
            className={`btn text-sm whitespace-nowrap ${
              view === 'create' ? 'btn-primary' : ''
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Process
          </button>
        </nav>

        {/* Views */}
        {view === 'list' && (
          <ProcessList
            processes={processes}
            onEdit={handleEdit}
            onLessons={handleLessons}
            onAssign={handleAssign}
            onDelete={loadProcesses}
          />
        )}
        {view === 'create' && (
          <ProcessForm onSaved={handleSaved} onCancel={() => setView('list')} />
        )}
        {view === 'edit' && selectedProcess && (
          <ProcessForm process={selectedProcess} onSaved={handleSaved} onCancel={() => setView('list')} />
        )}
        {view === 'lessons' && selectedProcess && (
          <LessonManager 
            processId={selectedProcess.id} 
            processTitle={selectedProcess.title} 
            onBack={() => setView('list')} 
          />
        )}
        {view === 'assign' && selectedProcess && (
          <StudentAssignment 
            processId={selectedProcess.id} 
            processTitle={selectedProcess.title} 
            onBack={() => setView('list')} 
          />
        )}
      </main>
    </div>
  )
}
