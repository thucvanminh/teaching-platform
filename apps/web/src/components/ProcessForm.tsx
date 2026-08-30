import { useState } from 'react'
import api from '../lib/api'

interface Props {
  process?: any
  onSaved: () => void
  onCancel: () => void
}

export default function ProcessForm({ process, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(process?.title || '')
  const [description, setDescription] = useState(process?.description || '')
  const [status, setStatus] = useState(process?.status || 'active')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (process) {
        await api.put(`/api/processes/${process.id}`, { title, description, status })
      } else {
        await api.post('/api/processes', { title, description })
      }
      onSaved()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-lg">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-6">
        {process ? 'Edit Process' : 'New Process'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Title
          </label>
          <input 
            type="text" 
            placeholder="Enter process title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Description
          </label>
          <textarea 
            placeholder="Enter description (optional)" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[100px] resize-y"
            rows={3} 
          />
        </div>

        {process && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Status
            </label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="input"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary flex-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save'
            )}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
