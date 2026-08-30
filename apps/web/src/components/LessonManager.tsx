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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="btn btn-secondary text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Lessons</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">{processTitle}</p>
        </div>
      </div>

      {/* Add Lesson Button */}
      {!showForm && (
        <button 
          onClick={() => { resetForm(); setShowForm(true) }} 
          className="btn btn-primary mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lesson
        </button>
      )}

      {/* Lesson Form */}
      {showForm && (
        <div className="glass-card max-w-lg mb-6">
          <h3 className="font-bold text-lg text-white font-heading mb-4">
            {editLesson ? 'Edit Lesson' : 'New Lesson'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Title</label>
              <input 
                type="text" 
                placeholder="Enter lesson title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="input" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Description</label>
              <textarea 
                placeholder="Enter description (optional)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="input min-h-[80px] resize-y"
                rows={2} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Type</label>
              <select 
                value={lessonType} 
                onChange={(e) => setLessonType(e.target.value)} 
                className="input"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="document">Document</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Content URL</label>
              <input 
                type="text" 
                placeholder="https://..." 
                value={contentUrl} 
                onChange={(e) => setContentUrl(e.target.value)} 
                className="input" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Order Index</label>
              <input 
                type="number" 
                placeholder="0" 
                value={orderIndex} 
                onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)} 
                className="input" 
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📖</div>
          <h3 className="text-xl font-bold text-white font-heading mb-2">No lessons yet</h3>
          <p className="text-[var(--color-text-secondary)]">Add your first lesson to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.sort((a, b) => a.orderIndex - b.orderIndex).map((l, idx) => (
            <div key={l.id} className="quiz-card animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="question-number">{l.orderIndex}</div>
                  <div>
                    <h4 className="font-medium text-white">{l.title}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-[var(--color-text-secondary)]">
                      {l.lessonType}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(l)} className="btn btn-ghost text-sm px-3 py-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(l.id)} className="btn btn-ghost text-sm px-3 py-2 text-[var(--color-error)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
