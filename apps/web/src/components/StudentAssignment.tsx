import { useEffect, useState } from 'react'
import api from '../lib/api'

interface Props {
  processId: string
  processTitle: string
  onBack: () => void
}

export default function StudentAssignment({ processId, processTitle, onBack }: Props) {
  const [students, setStudents] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    const [studentsRes, assignmentsRes] = await Promise.all([
      api.get('/api/student-processes/students'),
      api.get('/api/student-processes')
    ])
    setStudents(studentsRes.data)
    setAssignments(assignmentsRes.data.filter((a: any) => a.processId === processId))
  }

  useEffect(() => { loadData() }, [processId])

  const handleAssign = async () => {
    if (!selectedStudent) return
    setLoading(true)
    try {
      await api.post('/api/student-processes', { studentId: selectedStudent, processId })
      setSelectedStudent('')
      loadData()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleUnassign = async (id: string) => {
    if (!confirm('Remove student from this process?')) return
    await api.delete(`/api/student-processes/${id}`)
    loadData()
  }

  const assignedStudentIds = assignments.map(a => a.studentId)
  const availableStudents = students.filter(s => !assignedStudentIds.includes(s.id))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="btn text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Students</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{processTitle}</p>
        </div>
      </div>

      {/* Assign Form */}
      <div className="card max-w-lg mb-8">
        <h3 className="font-semibold text-[var(--color-text)] mb-4">Assign Student</h3>
        <div className="flex gap-3">
          <select 
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(e.target.value)} 
            className="input flex-1"
          >
            <option value="">Select a student...</option>
            {availableStudents.map(s => (
              <option key={s.id} value={s.id}>{s.fullName}</option>
            ))}
          </select>
          <button 
            onClick={handleAssign} 
            disabled={loading || !selectedStudent}
            className="btn btn-primary"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Assigning...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Assign
              </>
            )}
          </button>
        </div>
      </div>

      {/* Assigned Students List */}
      <h3 className="font-semibold text-[var(--color-text)] mb-4">Assigned Students</h3>
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No students assigned</h3>
          <p className="text-[var(--color-text-secondary)]">Assign students to this process using the form above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => (
            <div key={a.id} className="quiz-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                    {(a.studentName || a.studentId).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text)]">{a.studentName || a.studentId}</h4>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Assigned {new Date(a.assignedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUnassign(a.id)} 
                  className="btn text-sm px-3 py-2 text-[var(--color-error)]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
