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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Teacher Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.fullName}</span>
            <button onClick={signOut} className="text-red-600 hover:text-red-700">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex gap-2 mb-6">
          <button onClick={() => setView('list')} className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700">Processes</button>
          <button onClick={() => { setSelectedProcess(null); setView('create') }} className="px-4 py-2 rounded-lg bg-green-100 text-green-700">+ New Process</button>
        </nav>

        {view === 'list' && (
          <ProcessList
            processes={processes}
            onEdit={handleEdit}
            onLessons={handleLessons}
            onAssign={handleAssign}
            onDelete={loadProcesses}
          />
        )}
        {view === 'create' && <ProcessForm onSaved={handleSaved} onCancel={() => setView('list')} />}
        {view === 'edit' && selectedProcess && (
          <ProcessForm process={selectedProcess} onSaved={handleSaved} onCancel={() => setView('list')} />
        )}
        {view === 'lessons' && selectedProcess && (
          <LessonManager processId={selectedProcess.id} processTitle={selectedProcess.title} onBack={() => setView('list')} />
        )}
        {view === 'assign' && selectedProcess && (
          <StudentAssignment processId={selectedProcess.id} processTitle={selectedProcess.title} onBack={() => setView('list')} />
        )}
      </main>
    </div>
  )
}
