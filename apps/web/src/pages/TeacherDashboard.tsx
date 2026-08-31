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
      <header className="glass-header py-3 sm:py-4 px-4 sm:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center font-bold shadow-[0_0_16px_var(--color-primary-glow)] border border-white/40">
              T
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-heading">Teacher Dashboard</h1>
              <p className="text-xs text-[var(--color-text-secondary)]">Manage your courses</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-text-secondary)] hidden sm:block">{user?.fullName}</span>
            <button onClick={signOut} className="btn btn-ghost text-sm px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with comfortable spacing from top bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-16">
        {/* Navigation Tabs Bar - Centered on Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-[10px]">
          <nav className="flex items-center justify-center sm:justify-start gap-2 p-1.5 rounded-2xl glass-panel w-full sm:w-auto shadow-sm">
            <button 
              onClick={() => setView('list')} 
              className={`btn text-sm px-5 py-2.5 flex-1 sm:flex-initial justify-center rounded-xl transition-all ${
                view === 'list' 
                  ? 'btn-primary shadow-md' 
                  : 'btn-ghost text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Processes</span>
            </button>
            <button 
              onClick={() => { setSelectedProcess(null); setView('create') }} 
              className={`btn text-sm px-5 py-2.5 flex-1 sm:flex-initial justify-center rounded-xl transition-all ${
                view === 'create' 
                  ? 'btn-primary shadow-md' 
                  : 'btn-ghost text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Process</span>
            </button>
          </nav>
        </div>

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
