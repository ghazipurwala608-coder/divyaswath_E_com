import { copyWithToast } from '../utils/clipboard.js'
import { Eye, ExternalLink, Upload, ImagePlus, Loader2, RefreshCw, Search, Trash2, Copy, Check, Link2, ArrowUpRight, ImageIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { DataState, EmptyState, Modal, useAdminData } from './AdminUI.jsx'

export default function MediaLibrary({ onSelect }) {
  const uploadInFlight = useRef(false)
  useEffect(() => {
    // Dropping outside the upload zone must not navigate away to the local file.
    const preventFileNavigation = event => {
      if (Array.from(event.dataTransfer?.types || []).includes('Files')) event.preventDefault()
    }
    window.addEventListener('dragover', preventFileNavigation)
    window.addEventListener('drop', preventFileNavigation)
    return () => {
      window.removeEventListener('dragover', preventFileNavigation)
      window.removeEventListener('drop', preventFileNavigation)
    }
  }, [])
  const { data, setData, loading, error, reload } = useAdminData('/admin/media')
  const [recentUploads, setRecentUploads] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'uploaded' | 'builtin'
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [deletingUrl, setDeletingUrl] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [copiedUrl, setCopiedUrl] = useState('')
  const [showUrlImport, setShowUrlImport] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [importingUrl, setImportingUrl] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const uploadFile = async file => {
    if (!file || uploadInFlight.current) return
    setUploadError('')

    if (file.size > 10 * 1024 * 1024) {
      const msg = 'Image size must be under 10 MB'
      setUploadError(msg)
      return toast.error(msg)
    }

    const isValidExt = /\.(png|jpe?g|webp|svg|gif|avif|jfif)$/i.test(file.name)
    const isImageMime = file.type?.startsWith('image/')
    if (!isImageMime && !isValidExt) {
      const msg = 'Please choose a PNG, JPEG, WebP, SVG, GIF or AVIF image'
      setUploadError(msg)
      return toast.error(msg)
    }

    uploadInFlight.current = true
    setUploading(true)
    setUploadStatus(`Uploading ${file.name} to Cloudinary...`)
    const toastId = toast.loading(`Uploading ${file.name} to Cloudinary…`)
    try {
      const signed = await apiRequest('/admin/media/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: file.name,
        }),
      })

      const body = new FormData()
      for (const [key, value] of Object.entries(signed.params)) body.append(key, String(value))
      body.append('file', file)
      const response = await fetch(signed.uploadUrl, { method: 'POST', body, signal: AbortSignal.timeout(120000) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error?.message || 'Cloudinary upload failed')
      const newMedia = { name: file.name, url: result.secure_url, public_id: result.public_id, format: result.format, bytes: result.bytes, createdAt: result.created_at }
      if (!newMedia?.url) {
        throw new Error('The server did not return an uploaded image. Please check Cloudinary connection.')
      }

      setRecentUploads(current => [newMedia, ...current.filter(item => item.url !== newMedia.url)])
      setData(current => ({
        media: [newMedia, ...(current?.media || []).filter(m => m.url !== newMedia.url)],
      }))
      setFilter('all')
      setQuery('')
      setUploadStatus(`${file.name} uploaded successfully to Cloudinary!`)
      toast.success('Image uploaded successfully to Cloudinary!', { id: toastId, duration: 5000 })
    } catch (err) {
      console.error('Media upload error:', err)
      setUploadStatus('')
      const msg = err.name === 'TimeoutError'
        ? 'Upload timed out. Check your internet connection and try again.'
        : err.message || 'Failed to upload image'
      setUploadError(msg)
      toast.error(msg, { id: toastId })
    } finally {
      uploadInFlight.current = false
      setUploading(false)
    }
  }

  const handleUrlImport = async e => {
    e.preventDefault()
    if (!importUrl.trim() || importingUrl) return
    let parsed
    try {
      parsed = new URL(importUrl.trim())
    } catch {
      return toast.error('Please enter a valid https:// image link')
    }
    if (parsed.protocol !== 'https:') {
      return toast.error('Only secure HTTPS image links are supported')
    }

    setImportingUrl(true)
    const toastId = toast.loading('Importing image to Cloudinary…')
    try {
      const result = await apiRequest('/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl.trim() }),
      })

      const newMedia = result?.media || result
      if (!newMedia?.url) throw new Error('Failed to import image to Cloudinary')

      setRecentUploads(current => [newMedia, ...current.filter(item => item.url !== newMedia.url)])
      setData(current => ({
        media: [newMedia, ...(current?.media || []).filter(m => m.url !== newMedia.url)],
      }))
      setImportUrl('')
      setShowUrlImport(false)
      toast.success('Image imported successfully to Cloudinary!', { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Failed to import image', { id: toastId })
    } finally {
      setImportingUrl(false)
    }
  }

  const handleDelete = async (event, item) => {
    event.stopPropagation()
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}" from Cloudinary?\n\nURL: ${item.url}`)
    if (!confirmDelete) return

    setDeletingUrl(item.url)
    try {
      await apiRequest('/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.url, public_id: item.public_id, name: item.name }),
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

  const copyUrl = async (event, url) => {
    event.stopPropagation()
    if (!await copyWithToast(url, 'Image link copied to clipboard!')) return
    setCopiedUrl(url)

    setTimeout(() => setCopiedUrl(''), 2500)
  }

  // Combine recent uploads and fetched media
  const allMedia = [...new Map([...recentUploads, ...(data?.media || [])].map(item => [item.url, item])).values()]

  const isItemUploaded = item =>
    Boolean(
      item.public_id?.includes('uploads') ||
      item.url?.includes('/divyaswasth/uploads/') ||
      item.url?.startsWith('/api/media/') ||
      recentUploads.some(r => r.url === item.url)
    )

  const uploadedCount = allMedia.filter(isItemUploaded).length
  const builtinCount = allMedia.length - uploadedCount

  const filteredMedia = allMedia
    .filter(item => {
      if (filter === 'uploaded') return isItemUploaded(item)
      if (filter === 'builtin') return !isItemUploaded(item)
      return true
    })
    .filter(item => `${item.name || ''} ${item.url || ''}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="admin-media-library">
      {/* Top Search & Filter Bar */}
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

      {/* Upload & Import Dropzone Box */}
      <div
        onDragOver={e => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files?.[0]
          if (file) void uploadFile(file)
        }}
        style={{
          border: isDragging ? '2px dashed #2d5a36' : '1px dashed #c4d6b6',
          borderRadius: 12,
          padding: '20px 24px',
          background: isDragging ? '#eaf3e6' : '#f7faf4',
          marginBottom: 16,
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <label
            className="admin-button"
            style={{
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              opacity: uploading ? 0.7 : 1,
            }}
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{uploading ? 'Uploading to Cloudinary...' : 'Upload Image from Device'}</span>
            <input
              type="file"
              accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.gif,.avif,.jfif"
              disabled={uploading}
              onChange={event => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (file) void uploadFile(file)
              }}
              style={{ display: 'none' }}
            />
          </label>

          <button
            type="button"
            className="admin-button secondary"
            onClick={() => setShowUrlImport(prev => !prev)}
            disabled={uploading || importingUrl}
          >
            <Link2 size={16} />
            {showUrlImport ? 'Hide URL Import' : 'Import from Web URL'}
          </button>
        </div>

        {showUrlImport && (
          <form
            onSubmit={handleUrlImport}
            style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 520, marginTop: 4 }}
          >
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={importUrl}
              onChange={e => setImportUrl(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #c4d6b6',
                background: '#fff',
                fontSize: 13,
              }}
            />
            <button
              type="submit"
              className="admin-button"
              disabled={importingUrl || !importUrl.trim()}
            >
              {importingUrl ? <Loader2 size={14} className="animate-spin" /> : <ArrowUpRight size={14} />}
              Import
            </button>
          </form>
        )}

        <p style={{ margin: 0, fontSize: 12, color: '#55685a' }}>
          Drag & drop images here, or click upload. Supported formats: <strong>PNG, JPG, WebP, SVG, GIF, AVIF</strong> (up to 10 MB).
        </p>
      </div>

      {uploadStatus && (
        <p role="status" aria-live="polite" className="admin-hint" style={{ color: '#2d5a36', fontWeight: 500 }}>
          {uploadStatus}
          {recentUploads[0]?.url && (
            <a href={recentUploads[0].url} target="_blank" rel="noreferrer" style={{ marginLeft: 8, color: '#1b4332' }}>
              Open in new tab
            </a>
          )}
        </p>
      )}

      {uploadError && (
        <p role="alert" style={{ color: '#b42318', padding: 12, background: '#fff1f0', borderRadius: 8, marginBottom: 12 }}>
          {uploadError}
        </p>
      )}

      {error && allMedia.length > 0 && (
        <p role="alert" className="admin-hint" style={{ color: '#b42318' }}>
          Saved uploads are shown below. Library refresh notice: {error}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button
          type="button"
          className="admin-button secondary"
          onClick={reload}
          disabled={loading || uploading}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh gallery
        </button>
        <span style={{ fontSize: 12, color: '#728577' }}>
          Showing {filteredMedia.length} of {allMedia.length} images
        </span>
      </div>

      <DataState loading={loading && !allMedia.length} error={!allMedia.length ? error : ''} retry={reload}>
        {filteredMedia.length ? (
          <div className="admin-media-grid">
            {filteredMedia.map(item => {
              const uploaded = isItemUploaded(item)
              const isDeleting = deletingUrl === item.url
              const isCopied = copiedUrl === item.url

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
                    title={onSelect ? 'Click to select image' : 'View full image'}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        if (onSelect) onSelect(item.url)
                        else setPreview(item)
                      }
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.name || 'Image'}
                      loading="lazy"
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.parentElement.classList.add('admin-img-fallback')
                      }}
                    />
                    {uploaded && <span className="admin-media-tag">Uploaded</span>}
                  </div>

                  <div className="admin-media-info">
                    <span className="admin-media-name" title={item.name}>{item.name}</span>
                    <span className="admin-media-url" title={item.url}>{item.url}</span>
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
                        <Eye size={13} /> View
                      </button>
                    )}

                    <button
                      type="button"
                      className="admin-media-btn"
                      title="Copy Image URL"
                      onClick={e => copyUrl(e, item.url)}
                    >
                      {isCopied ? <Check size={13} color="#2d5a36" /> : <Copy size={13} />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>

                    <button
                      type="button"
                      className="admin-media-btn danger"
                      title="Delete from Cloudinary"
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

      {preview && (
        <Modal title="View image" onClose={() => setPreview(null)} wide>
          <div className="admin-modal-body" style={{ textAlign: 'center' }}>
            <div style={{ background: '#f8faf4', padding: 16, borderRadius: 8, marginBottom: 12 }}>
              <img
                src={preview.url}
                alt={preview.name}
                style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
              />
            </div>
            <p style={{ fontWeight: 600, fontSize: 14, margin: '8px 0 4px', wordBreak: 'break-all' }}>{preview.name}</p>
            <p style={{ fontSize: 12, color: '#68786b', wordBreak: 'break-all', marginBottom: 16 }}>{preview.url}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                type="button"
                className="admin-button secondary"
                onClick={e => copyUrl(e, preview.url)}
              >
                {copiedUrl === preview.url ? <Check size={16} /> : <Copy size={16} />}
                {copiedUrl === preview.url ? 'Link Copied!' : 'Copy Link'}
              </button>
              <a className="admin-button secondary" href={preview.url} target="_blank" rel="noreferrer">
                <ExternalLink size={16} /> Open full image
              </a>
              {onSelect && (
                <button
                  type="button"
                  className="admin-button"
                  onClick={() => {
                    onSelect(preview.url)
                    setPreview(null)
                  }}
                >
                  Use this image
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
