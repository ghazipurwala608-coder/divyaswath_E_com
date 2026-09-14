import { Check, Copy, ExternalLink, Filter, ImagePlus, Loader2, Search, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { DataState, EmptyState, useAdminData } from './AdminUI.jsx'

const fileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

export default function MediaLibrary({ onSelect }) {
  const { data, setData, loading, error, reload } = useAdminData('/admin/media')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'uploaded' | 'builtin'
  const [uploading, setUploading] = useState(false)
  const [deletingUrl, setDeletingUrl] = useState(null)
  const [copiedUrl, setCopiedUrl] = useState(null)
  const fileInputRef = useRef(null)

  const upload = async event => {
    const file = event.target.files?.[0]
    if (!file) return

    // 15 MB limit
    if (file.size > 15 * 1024 * 1024) {
      return toast.error('Image size must be under 15 MB')
    }

    const isValidExt = /\.(png|jpe?g|webp|svg|gif|avif|jfif)$/i.test(file.name)
    const isImageMime = file.type?.startsWith('image/')
    if (!isImageMime && !isValidExt) {
      return toast.error('Please choose a PNG, JPEG, WebP, SVG or GIF image')
    }

    setUploading(true)
    const toastId = toast.loading(`Uploading ${file.name}…`)
    try {
      const base64Data = await fileToBase64(file)
      const result = await apiRequest('/admin/media', {
        method: 'POST',
        body: JSON.stringify({
          name: file.name,
          data: base64Data,
        }),
      })

      const newMedia = result?.media || result
      if (newMedia && newMedia.url) {
        setData(current => ({
          media: [newMedia, ...(current?.media || []).filter(m => m.url !== newMedia.url)],
        }))
        setFilter('all')
      }
      reload()
      toast.success('Image uploaded successfully!', { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Failed to upload image', { id: toastId })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (event, item) => {
    event.stopPropagation()
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?\n\nURL: ${item.url}`)
    if (!confirmDelete) return

    setDeletingUrl(item.url)
    try {
      await apiRequest('/admin/media', {
        method: 'DELETE',
        body: JSON.stringify({ url: item.url, name: item.name }),
      })
      setData(current => ({
        media: (current?.media || []).filter(m => m.url !== item.url),
      }))
      toast.success(`Deleted ${item.name}`)
    } catch (err) {
      toast.error(err.message || 'Failed to delete image')
    } finally {
      setDeletingUrl(null)
    }
  }

  const handleCopy = async (event, url) => {
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
      toast.success('Image path copied!')
    } catch {
      toast.error('Unable to copy automatically. Path: ' + url)
    }
  }

  const allMedia = data?.media || []
  const uploadedCount = allMedia.filter(item => item.url?.startsWith('/api/media/')).length
  const builtinCount = allMedia.length - uploadedCount

  const filteredMedia = allMedia
    .filter(item => {
      if (filter === 'uploaded') return item.url?.startsWith('/api/media/')
      if (filter === 'builtin') return !item.url?.startsWith('/api/media/')
      return true
    })
    .filter(item => `${item.name} ${item.url}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="admin-media-library">
      <div className="admin-toolbar" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <label className="admin-search" style={{ minWidth: '240px', flex: 1 }}>
          <Search size={16} />
          <input
            placeholder="Search by image name or URL…"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </label>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            className={`admin-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({allMedia.length})
          </button>
          <button
            type="button"
            className={`admin-filter-btn ${filter === 'uploaded' ? 'active' : ''}`}
            onClick={() => setFilter('uploaded')}
          >
            Uploaded ({uploadedCount})
          </button>
          <button
            type="button"
            className={`admin-filter-btn ${filter === 'builtin' ? 'active' : ''}`}
            onClick={() => setFilter('builtin')}
          >
            Website ({builtinCount})
          </button>
        </div>

        <button
          type="button"
          className="admin-button"
          style={{ cursor: uploading ? 'wait' : 'pointer' }}
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading…' : 'Upload Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,.png,.jpg,.jpeg,.webp,.svg,.gif,.jfif,.avif"
          disabled={uploading}
          onChange={upload}
          style={{ display: 'none' }}
        />
      </div>

      <p className="admin-hint">
        Click on any image to copy its path or select it. Supported formats: PNG, JPEG, WebP, SVG, GIF (up to 10 MB).
      </p>

      <DataState loading={loading} error={error} retry={reload}>
        {filteredMedia.length ? (
          <div className="admin-media-grid">
            {filteredMedia.map(item => {
              const isUploaded = item.url?.startsWith('/api/media/')
              const isDeleting = deletingUrl === item.url
              const isCopied = copiedUrl === item.url

              return (
                <div key={item.url} className="admin-media-item">
                  <div
                    className="admin-media-preview"
                    onClick={() => {
                      if (onSelect) onSelect(item.url)
                      else handleCopy({ stopPropagation: () => {} }, item.url)
                    }}
                    role="button"
                    tabIndex={0}
                    title={onSelect ? 'Click to select image' : 'Click to copy path'}
                  >
                    <img src={item.url} alt={item.name} loading="lazy" />
                    {isUploaded && <span className="admin-media-tag">Uploaded</span>}
                  </div>

                  <div className="admin-media-info">
                    <span className="admin-media-name" title={item.name}>{item.name}</span>
                    <small className="admin-media-url" title={item.url}>{item.url}</small>
                  </div>

                  <div className="admin-media-actions">
                    {onSelect ? (
                      <button
                        type="button"
                        className="admin-media-btn primary"
                        onClick={() => onSelect(item.url)}
                      >
                        <ImagePlus size={13} /> Select
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-media-btn"
                        onClick={e => handleCopy(e, item.url)}
                      >
                        {isCopied ? <Check size={13} color="#2d5a36" /> : <Copy size={13} />}
                        {isCopied ? 'Copied' : 'Copy Path'}
                      </button>
                    )}

                    <button
                      type="button"
                      className="admin-media-btn danger"
                      title="Delete Image"
                      disabled={isDeleting}
                      onClick={e => handleDelete(e, item)}
                    >
                      {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyState
            title="No images found"
            text={query ? `No images matching "${query}"` : 'Upload your first image using the button above.'}
          />
        )}
      </DataState>
    </div>
  )
}

