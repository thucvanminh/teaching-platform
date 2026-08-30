import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function StudentDashboard() {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">My Learning</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.fullName}</span>
            <button onClick={signOut} className="text-red-600 hover:text-red-700">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedProcess ? (
          <div>
            <button onClick={() => setSelectedProcess(null)} className="text-blue-600 hover:underline mb-4">&larr; Back to processes</button>
            <h2 className="text-xl font-bold mb-4">{selectedProcess.title}</h2>
            <div className="space-y-3">
              {selectedProcess.lessons?.sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((l: any) => (
                <div key={l.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">#{l.orderIndex}</span>
                    <span className="font-medium">{l.title}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{l.lessonType}</span>
                  </div>
                  {l.description && <p className="text-sm text-gray-500 mt-1 ml-6">{l.description}</p>}
                  {l.contentUrl && (
                    <a href={l.contentUrl} target="_blank" rel="noopener noreferrer"
                      className="ml-6 text-sm text-blue-600 hover:underline">Open material &rarr;</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {assignments.length === 0 ? (
              <p className="text-gray-500">No processes assigned yet. Wait for your teacher to assign one.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((a) => (
                  <div key={a.id} className="bg-white rounded-xl shadow p-5">
                    <h3 className="font-semibold text-lg">{a.processTitle}</h3>
                    <p className="text-sm text-gray-400 mt-1">Assigned {new Date(a.assignedAt).toLocaleDateString()}</p>
                    <button onClick={() => viewLessons(a.processId)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">View Lessons</button>
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
