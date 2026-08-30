import { useEffect, useState } from 'react'
import api from '../lib/api'

interface Props {
  processId: string
  processTitle: string
  onBack: () => void
}

export default function LessonManager({ processId, processTitle, onBack }: Props) {
  const [lessons, setLessons] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editLesson, setEditLesson] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [lessonType, setLessonType] = useState('video')
  const [contentUrl, setContentUrl] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadLessons = async () => {
    const { data } = await api.get(`/api/processes/${processId}`)
    setLessons(data.lessons || [])
  }

  useEffect(() => { loadLessons() }, [processId])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setLessonType('video')
    setContentUrl('')
    setOrderIndex(0)
    setEditLesson(null)
    setShowForm(false)
  }

  const handleEdit = (l: any) => {
    setTitle(l.title)
    setDescription(l.description || '')
    setLessonType(l.lessonType)
    setContentUrl(l.contentUrl)
    setOrderIndex(l.orderIndex)
    setEditLesson(l)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editLesson) {
        await api.put(`/api/lessons/${editLesson.id}`, { title, description, lessonType, contentUrl, orderIndex })
      } else {
        await api.post(`/api/lessons/process/${processId}`, { title, description, lessonType, contentUrl, orderIndex })
      }
      resetForm()
      loadLessons()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lesson?')) return
    await api.delete(`/api/lessons/${id}`)
    loadLessons()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-blue-600 hover:underline">&larr; Back</button>
        <h2 className="text-xl font-bold">Lessons: {processTitle}</h2>
      </div>

      {!showForm && (
        <button onClick={() => { resetForm(); setShowForm(true) }} className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">+ Add Lesson</button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-lg mb-6">
          <h3 className="font-semibold mb-4">{editLesson ? 'Edit Lesson' : 'New Lesson'}</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows={2} />
            <select value={lessonType} onChange={(e) => setLessonType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="document">Document</option>
            </select>
            <input type="text" placeholder="Content URL" value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            <input type="number" placeholder="Order" value={orderIndex} onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 border rounded-lg" />
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {lessons.length === 0 ? (
        <p className="text-gray-500">No lessons yet.</p>
      ) : (
        <div className="space-y-3">
          {lessons.sort((a, b) => a.orderIndex - b.orderIndex).map((l) => (
            <div key={l.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-400 mr-2">#{l.orderIndex}</span>
                <span className="font-medium">{l.title}</span>
                <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded-full">{l.lessonType}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(l)} className="text-sm text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(l.id)} className="text-sm text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
