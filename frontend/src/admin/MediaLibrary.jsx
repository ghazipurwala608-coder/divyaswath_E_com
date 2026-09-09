import { ImagePlus, Search, Upload } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { DataState, EmptyState, useAdminData } from './AdminUI.jsx'

export default function MediaLibrary({ onSelect }) {
  const { data, setData, loading, error, reload } = useAdminData('/admin/media')
  const [query, setQuery] = useState('')
  const [uploading, setUploading] = useState(false)
  const upload = async event => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024 || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return toast.error('Use a PNG, JPEG or WebP image under 5 MB')
    setUploading(true)
    try {
      const { media } = await apiRequest('/admin/media', { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file })
      setData(current => ({ media: [media, ...(current?.media || [])] }))
      toast.success('Image uploaded')
    } catch (err) { toast.error(err.message) } finally { setUploading(false); event.target.value = '' }
  }
  const media = data?.media.filter(item => `${item.name} ${item.url}`.toLowerCase().includes(query.toLowerCase())) || []
  return <div className="admin-media-library"><div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input placeholder="Search images…" value={query} onChange={event => setQuery(event.target.value)} /></label><label className="admin-button"><Upload size={16} />{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={upload} hidden /></label></div><p className="admin-hint">Existing website images and uploads. PNG, JPEG or WebP, up to 5 MB.</p><DataState loading={loading} error={error} retry={reload}>{media.length ? <div className="admin-media-grid">{media.map(item => <button key={item.url} onClick={async () => { if (onSelect) onSelect(item.url); else { try { await navigator.clipboard.writeText(item.url); toast.success('Image path copied') } catch { toast.error('Unable to copy. Select the path below the image.') } } }}><img src={item.url} alt={item.name} loading="lazy" /><span>{item.name}</span><small>{item.url}</small><b><ImagePlus size={13} />{onSelect ? 'Use image' : 'Copy path'}</b></button>)}</div> : <EmptyState title="No images found" text="Try another search or upload an image." />}</DataState></div>
}
