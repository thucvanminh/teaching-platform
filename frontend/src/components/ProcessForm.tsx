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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-lg">
      <h2 className="text-lg font-semibold mb-4">{process ? 'Edit Process' : 'New Process'}</h2>
      <div className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg" rows={3} />
        {process && (
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        )}
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    </form>
  )
}
