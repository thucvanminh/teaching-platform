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
    return <p className="text-gray-500">No processes yet. Create one to get started.</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {processes.map((p) => (
        <div key={p.id} className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-lg">{p.title}</h3>
          <p className="text-gray-500 text-sm mt-1">{p.description || 'No description'}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {p.status}
            </span>
            <span className="text-xs text-gray-400">{p.lessonCount} lessons</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => onEdit(p)} className="text-sm px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Edit</button>
            <button onClick={() => onLessons(p)} className="text-sm px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600">Lessons</button>
            <button onClick={() => onAssign(p)} className="text-sm px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Assign</button>
            <button onClick={() => handleDelete(p.id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
