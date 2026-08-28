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
      api.get('/api/studentprocesses/students'),
      api.get('/api/studentprocesses')
    ])
    setStudents(studentsRes.data)
    setAssignments(assignmentsRes.data.filter((a: any) => a.processId === processId))
  }

  useEffect(() => { loadData() }, [processId])

  const handleAssign = async () => {
    if (!selectedStudent) return
    setLoading(true)
    try {
      await api.post('/api/studentprocesses', { studentId: selectedStudent, processId })
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
    await api.delete(`/api/studentprocesses/${id}`)
    loadData()
  }

  const assignedStudentIds = assignments.map(a => a.studentId)
  const availableStudents = students.filter(s => !assignedStudentIds.includes(s.id))

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-blue-600 hover:underline">&larr; Back</button>
        <h2 className="text-xl font-bold">Students: {processTitle}</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-6 max-w-lg mb-6">
        <h3 className="font-semibold mb-3">Assign Student</h3>
        <div className="flex gap-2">
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg">
            <option value="">Select a student...</option>
            {availableStudents.map(s => (
              <option key={s.id} value={s.id}>{s.fullName}</option>
            ))}
          </select>
          <button onClick={handleAssign} disabled={loading || !selectedStudent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>

      <h3 className="font-semibold mb-3">Assigned Students</h3>
      {assignments.length === 0 ? (
        <p className="text-gray-500">No students assigned yet.</p>
      ) : (
        <div className="space-y-2">
          {assignments.map(a => (
            <div key={a.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <span className="font-medium">{a.studentName || a.studentId}</span>
                <span className="text-sm text-gray-400 ml-2">assigned {new Date(a.assignedAt).toLocaleDateString()}</span>
              </div>
              <button onClick={() => handleUnassign(a.id)} className="text-sm text-red-600 hover:underline">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
