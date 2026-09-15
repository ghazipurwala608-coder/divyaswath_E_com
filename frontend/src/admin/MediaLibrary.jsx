import { Eye, ExternalLink, Upload, ImagePlus, Loader2, RefreshCw, Search, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { DataState, EmptyState, Modal, useAdminData } from './AdminUI.jsx'

export default function MediaLibrary({ onSelect }) {
  const { data, setData, loading, error, reload } = useAdminData('/admin/media')
  const [recentUploads, setRecentUploads] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'uploaded' | 'builtin'
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [deletingUrl, setDeletingUrl] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const fileInputRef = useRef(null)

  const upload = async file => {
    if (!file || uploading) return
    setUploadError('')
    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be under 10 MB')
      return toast.error('Image size must be under 10 MB')
    }

    const isValidExt = /\.(png|jpe?g|webp|svg|gif|avif|jfif)$/i.test(file.name)
    const isImageMime = file.type?.startsWith('image/')
    if (!isImageMime && !isValidExt) {
      setUploadError('Please choose a PNG, JPEG, WebP, SVG, GIF or AVIF image')
      return toast.error('Please choose a PNG, JPEG, WebP, SVG, GIF or AVIF image')
    }

    setUploading(true)
    setUploadStatus(`Uploading ${file.name}...`)
    const toastId = toast.loading(`Uploading ${file.name}…`)
    try {
      setUploadStatus(`Uploading ${file.name}...`)
      const result = await apiRequest('/admin/media', {
        method: 'POST',
        signal: AbortSignal.timeout(90000),
        headers: { 'Content-Type': 'application/octet-stream', 'X-File-Name': encodeURIComponent(file.name) },
        body: file,
      })

      const newMedia = result?.media || result
      if (!newMedia?.url) throw new Error('The server did not return an uploaded image. Please check the backend connection.')
      if (newMedia.url) {
        setRecentUploads(current => [newMedia, ...current.filter(item => item.url !== newMedia.url)])
        setData(current => ({
          media: [newMedia, ...(current?.media || []).filter(m => m.url !== newMedia.url)],
        }))
        setFilter('uploaded')
        setQuery('')
        await reload()
      }
      setUploadStatus(`${file.name} uploaded successfully. It is now available in Uploaded.`)
      toast.success('Image uploaded successfully!', { id: toastId, duration: 5000 })
    } catch (err) {
      setUploadStatus('')
      setUploadError(err.name === 'TimeoutError' ? 'Upload timed out. Check your internet connection and try again.' : err.message || 'Failed to upload image')
      toast.error(err.message || 'Failed to upload image', { id: toastId })
    } finally {
      setUploading(false)
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
      setRecentUploads(current => current.filter(media => media.url !== item.url))
      toast.success(`Deleted ${item.name}`)
    } catch (err) {
      toast.error(err.message || 'Failed to delete image')
    } finally {
      setDeletingUrl(null)
    }
  }

  const allMedia = [...new Map([...recentUploads, ...(data?.media || [])].map(item => [item.url, item])).values()]
  const uploadedCount = allMedia.filter(item => (item.url?.startsWith('/api/media/') || item.url?.includes('/divyaswasth/uploads/'))).length
  const builtinCount = allMedia.length - uploadedCount

  const filteredMedia = allMedia
    .filter(item => {
      if (filter === 'uploaded') return (item.url?.startsWith('/api/media/') || item.url?.includes('/divyaswasth/uploads/'))
      if (filter === 'builtin') return !(item.url?.startsWith('/api/media/') || item.url?.includes('/divyaswasth/uploads/'))
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

      </div>
      <div className="admin-toolbar" style={{ flexWrap: 'wrap', gap: 12, padding: 16, background: '#f4f7f2', borderRadius: 8 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif,.jfif"
          disabled={uploading}
          onChange={event => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (!file) {
              setUploadStatus('No image selected.')
              return
            }
            setUploadError('')
            setUploadStatus('')
            void upload(file)
          }}
          hidden
        />
        <button
          type="button"
          className="admin-button"
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
            fileInputRef.current?.click()
          }}
          disabled={uploading}
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
      <p className="admin-hint">
        Upload an image directly from your device. Your uploaded image will appear in this gallery. Click View to open it. Supported formats: PNG, JPEG, WebP, SVG, GIF (up to 10 MB).
      </p>

      {uploadStatus && <p role="status" aria-live="polite" className="admin-hint">
        {uploadStatus}
        {recentUploads[0]?.url && <a href={recentUploads[0].url} target="_blank" rel="noreferrer" style={{ marginLeft: 8 }}>Open image</a>}
      </p>}
      {uploadError && <p role="alert" style={{ color: '#b42318', padding: 12, background: '#fff1f0', borderRadius: 8 }}>{uploadError}</p>}
      {error && allMedia.length > 0 && <p role="alert" className="admin-hint">Saved uploads are shown below. Library refresh failed: {error}</p>}
      <button type="button" className="admin-button secondary" onClick={reload} disabled={loading || uploading} style={{ marginBottom: 12 }}><RefreshCw size={16} /> Refresh gallery</button>
      <DataState loading={loading && !allMedia.length} error={!allMedia.length ? error : ''} retry={reload}>
        {filteredMedia.length ? (
          <div className="admin-media-grid">
            {filteredMedia.map(item => {
              const isUploaded = (item.url?.startsWith('/api/media/') || item.url?.includes('/divyaswasth/uploads/'))
              const isDeleting = deletingUrl === item.url

              return (
                <div key={item.url} className="admin-media-item">
                  <div
                    className="admin-media-preview"
                    onClick={() => {
                      if (onSelect) onSelect(item.url)
                      else setPreview(item)
                    }}
                    role="button"
                    tabIndex={0}
                    title={onSelect ? 'Click to select image' : 'View image'}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (onSelect) onSelect(item.url); else setPreview(item) } }}
                  >
                    <img src={item.url} alt={item.name} loading="lazy" />
                    {isUploaded && <span className="admin-media-tag">Uploaded</span>}
                  </div>

                  <div className="admin-media-info">
                    <span className="admin-media-name" title={item.name}>{item.name}</span>

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
                        onClick={() => setPreview(item)}
                      >
                        <Eye size={13} />
                        View
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
      {preview && <Modal title="View image" onClose={() => setPreview(null)} wide><div className="admin-modal-body"><img src={preview.url} alt={preview.name} style={{ display: 'block', width: '100%', maxHeight: '70vh', objectFit: 'contain' }} /><p>{preview.name}</p><a className="admin-button secondary" href={preview.url} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Open full image</a>{onSelect && <button type="button" className="admin-button" onClick={() => { onSelect(preview.url); setPreview(null) }}>Use this image</button>}</div></Modal>}
    </div>
  )
}

