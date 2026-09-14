import { ExternalLink, ImagePlus, RefreshCw, Save, Search, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { DataState, Modal, useAdminData } from './AdminUI.jsx'
import MediaLibrary from './MediaLibrary.jsx'

const fileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

const readable = text => String(text).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase())

const labels = {
  'brand-logo': 'Brand Logo & Identity',
  home: 'Homepage (Hero & Banners)',
  header: 'Header & Navigation',
  footer: 'Footer & Contact',
  settings: 'Store Settings',
  articles: 'Wellness Articles',
  policy: 'Shipping, Returns & Policies',
  'vital-infinity-product': 'Vital Infinity Layout',
  about: 'About Us Page',
  ingredients: 'Ingredients Page',
  faq: 'FAQ Page',
  wellness: 'Wellness Quiz & Page',
  'wellness-article': 'Wellness Article Template',
  contact: 'Contact Us Page',
  support: 'Customer Support Page',
  shop: 'Shop Catalog Page',
  cart: 'Shopping Cart Page',
  checkout: 'Checkout Page',
  'order-success': 'Order Success Page',
  'order-tracking': 'Order Tracking Page',
}

const PAGE_ORDER = ['brand-logo', 'home', 'header', 'footer', 'settings', 'articles', 'policy', 'about', 'ingredients', 'shop', 'vital-infinity-product', 'faq', 'wellness', 'contact', 'support']

const FIELD_LABELS = {
  'brand-logo.media.src_2': 'Website Brand Logo Image',
  'brand-logo.media.to_1': 'Logo Link Destination',
  'brand-logo.text.divya': 'Brand Name (Part 1 - DIVYA)',
  'brand-logo.text.swasth': 'Brand Name (Part 2 - SWASTH)',
  'brand-logo.text.natural_healing_holistic_wellness_healthy_fut': 'Brand Tagline / Slogan',
  'home.media.src_1': 'Hero Banner / Poster Image (Main)',
  'home.media.alt_2': 'Hero Banner Alt Text',
  'home.media.to_3': 'Hero Primary Button Link',
  'home.media.to_4': 'Hero Secondary Button Link',
  'home.media.src_5': 'Hero Brand Badge Emblem Image',
  'home.media.src_8': 'Botanicals Section Banner Image',
  'home.media.src_10': 'Mid-Page Center Banner Image',
  'home.text.natural_healing': 'Hero Eyebrow Text (e.g. NATURAL HEALING)',
  'home.text.holistic': 'Hero Title Line 1 (e.g. HOLISTIC)',
  'home.text.wellness': 'Hero Title Line 2 (e.g. WELLNESS)',
  'home.text.healthy_future': 'Hero Sub-heading (e.g. HEALTHY FUTURE)',
  'home.text.ancient_wisdom_modern_wellness': 'Hero Mission Statement Line 1',
  'home.text.thoughtfully_crafted_for_you_and_your_family': 'Hero Mission Statement Line 2',
  'home.text.explore_our_products': 'Hero Primary Button Label',
  'home.text.watch_our_story': 'Hero Secondary Button Label',
  'footer.media.src_2': 'Footer Brand Logo Image',
  'footer.text.divya': 'Footer Brand Name (Part 1)',
  'footer.text.swasth': 'Footer Brand Name (Part 2)',
}

function getFieldLabel(path, key, parentIsArray) {
  const fullPath = [...path, key].join('.')
  if (FIELD_LABELS[fullPath]) return FIELD_LABELS[fullPath]
  if (parentIsArray) return `Field ${Number(key) + 1}`
  return readable(key)
}

function replaceValue(root, path, value) {
  const copy = structuredClone(root)
  let node = copy
  path.slice(0, -1).forEach(key => { node = node[key] })
  node[path.at(-1)] = value
  return copy
}

export default function ContentPanel({ settingsOnly = false }) {
  const { data, setData, loading, error, reload } = useAdminData('/admin/content')
  const [selected, setSelected] = useState(settingsOnly ? 'settings' : 'brand-logo')
  const [draft, setDraft] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [imagePath, setImagePath] = useState(null)
  const logoInputRef = useRef(null)
  const heroInputRef = useRef(null)

  const handleDirectUpload = async (targetKeyPath, file, labelName) => {
    if (!file) return
    const toastId = toast.loading(`Uploading ${labelName}…`)
    try {
      const base64Data = await fileToBase64(file)
      const result = await apiRequest('/admin/media', {
        method: 'POST',
        body: JSON.stringify({ name: file.name, data: base64Data }),
      })
      const newMedia = result?.media || result
      if (newMedia?.url) {
        change(targetKeyPath, newMedia.url)
        toast.success(`${labelName} uploaded! Click "Save changes" below to publish.`, { id: toastId })
      } else {
        throw new Error('Could not get uploaded image URL')
      }
    } catch (err) {
      toast.error(err.message || `Failed to upload ${labelName}`, { id: toastId })
    }
  }

  const page = data?.pages?.find(item => item.key === selected)

  useEffect(() => {
    if (page) {
      setDraft(structuredClone(page.content))
      setDirty(false)
    }
  }, [page])

  useEffect(() => {
    if (!dirty) return
    const handler = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const change = (path, value) => {
    setDraft(current => replaceValue(current, path, value))
    setDirty(true)
  }

  const select = key => {
    if (!dirty || window.confirm('Discard unsaved page edits?')) {
      setSelected(key)
      setQuery('')
    }
  }

  const save = async event => {
    event.preventDefault()
    setSaving(true)
    try {
      const { page: updated } = await apiRequest(`/admin/content/${selected}`, {
        method: 'PUT',
        body: JSON.stringify({ content: draft, revision: page?.revision ?? 0 }),
      })
      setData(current => ({
        pages: (current?.pages || []).map(item => (item.key === selected ? updated : item)),
      }))
      window.dispatchEvent(new Event('site-content-updated'))
      toast.success(`${labels[selected] || selected} saved successfully!`)
      setDirty(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Sort available pages according to preferred PAGE_ORDER
  const sortedPages = (data?.pages || [])
    .filter(item => (settingsOnly ? item.key === 'settings' : item.key !== 'settings'))
    .sort((a, b) => {
      const indexA = PAGE_ORDER.indexOf(a.key)
      const indexB = PAGE_ORDER.indexOf(b.key)
      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      return a.key.localeCompare(b.key)
    })

  return (
    <DataState loading={loading} error={error} retry={reload}>
      <div className={`admin-content-layout ${settingsOnly ? 'settings-only' : ''}`}>
        {!settingsOnly && (
          <nav className="admin-content-nav" aria-label="Website pages">
            <strong>WEBSITE CONTENT</strong>
            {sortedPages.map(item => (
              <button
                key={item.key}
                className={selected === item.key ? 'active' : ''}
                onClick={() => select(item.key)}
              >
                {labels[item.key] || readable(item.key)}
              </button>
            ))}
          </nav>
        )}

        <section className="admin-panel admin-content-editor">
          <div className="admin-panel-heading">
            <div>
              <h2>{labels[selected] || readable(selected)}</h2>
              <p>Customize and manage your live store images and text.</p>
            </div>
            <a href="/" target="_blank" rel="noreferrer" className="admin-text-button">
              View live website <ExternalLink size={14} />
            </a>
          </div>

          {/* Quick Highlight Cards for Logo & Hero Banner */}
          {selected === 'brand-logo' && draft && (
            <div style={{ margin: '16px 18px', padding: '18px', background: '#fcfaf4', border: '1px solid #e7dcbe', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff', border: '2px solid #c8973a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 2px 8px rgba(200, 151, 58, 0.18)' }}>
                    <img
                      src={draft?.media?.src_2 || '/images/logo.png'}
                      alt="Brand Logo Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={e => { e.currentTarget.src = '/images/logo.png' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 'bold', lineHeight: 1, letterSpacing: '0.03em' }}>
                      <span style={{ color: '#0e3c1e' }}>{draft?.text?.divya || 'DIVYA'}</span>{' '}
                      <span style={{ color: '#be8a2f' }}>{draft?.text?.swasth || 'SWASTH'}</span>
                    </div>
                    <span style={{ fontSize: '7.5px', fontWeight: 'bold', color: '#3ca0be', display: 'block', marginTop: '4px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      {draft?.text?.natural_healing_holistic_wellness_healthy_fut || 'Natural healing · Holistic wellness · Healthy future'}
                    </span>
                    <div style={{ width: '140px', height: '1.5px', background: 'linear-gradient(to right, #be8a2f, #ddae48, transparent)', marginTop: '3px', borderRadius: '2px' }} />
                    <span style={{ fontSize: '10px', color: '#829561', display: 'block', marginTop: '4px', fontFamily: 'monospace' }}>
                      Path: {draft?.media?.src_2 || '/images/logo.png'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="admin-button"
                    style={{ background: '#2d5a36', color: '#fff' }}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <ImagePlus size={15} /> Upload New Logo
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,.png,.jpg,.jpeg,.webp,.svg,.gif,.jfif,.avif"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleDirectUpload(['media', 'src_2'], file, 'Logo')
                      e.target.value = ''
                    }}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    className="admin-button secondary"
                    onClick={() => setImagePath(['media', 'src_2'])}
                  >
                    Choose from Gallery
                  </button>
                </div>
              </div>
            </div>
          )}

          {selected === 'home' && draft && (
            <div style={{ margin: '16px 18px', padding: '18px', background: '#f4f7f2', border: '1px solid #d4dfd0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: '#163824', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="#c8973a" /> Homepage Hero Poster (Banner)
                  </strong>
                  <span style={{ fontSize: '12px', color: '#556b5a' }}>
                    This is the main hero banner image displayed at the very top of your homepage.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="admin-button"
                    style={{ background: '#2d5a36', color: '#fff' }}
                    onClick={() => heroInputRef.current?.click()}
                  >
                    <ImagePlus size={15} /> Upload Hero Poster
                  </button>
                  <input
                    ref={heroInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,.png,.jpg,.jpeg,.webp,.svg,.gif,.jfif,.avif"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleDirectUpload(['media', 'src_1'], file, 'Hero Poster')
                      e.target.value = ''
                    }}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    className="admin-button secondary"
                    onClick={() => setImagePath(['media', 'src_1'])}
                  >
                    Choose from Gallery
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative', width: '100%', maxHeight: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #c8d8c2', background: '#0a1c0e' }}>
                <img
                  src={draft?.media?.src_1 || '/images/home/hero home.png'}
                  alt="Hero Banner Preview"
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          <div className="admin-content-search">
            <label className="admin-search">
              <Search size={16} />
              <input
                placeholder="Find a section, image or text…"
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </label>
          </div>

          {draft && (
            <form onSubmit={save}>
              <div className="admin-content-fields">
                <ContentFields
                  value={draft}
                  path={[selected]}
                  onChange={change}
                  onImage={setImagePath}
                  query={query.toLowerCase()}
                />
              </div>
              <div className="admin-editor-footer">
                <span>
                  {dirty ? 'You have unsaved changes' : `All changes saved · Revision ${page?.revision ?? 0}`}
                </span>
                <button className="admin-button" disabled={saving || !dirty}>
                  <Save size={16} />
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      {imagePath && (
        <Modal title="Choose or Upload an Image" onClose={() => setImagePath(null)} wide>
          <div className="admin-modal-body">
            <MediaLibrary
              onSelect={url => {
                const targetKeyPath = imagePath[0] === selected ? imagePath.slice(1) : imagePath
                change(targetKeyPath, url)
                setImagePath(null)
              }}
            />
          </div>
        </Modal>
      )}
    </DataState>
  )
}

function ContentFields({ value, path, onChange, onImage, query }) {
  if (value && typeof value === 'object') {
    if (value.$icon) return null
    return Object.entries(value).map(([key, item]) => {
      if (['$icon', 'position', 'scale', 'className'].includes(key)) return null
      const next = [...path, key]
      const nextForState = next.slice(1) // exclude root page key for state modification

      if (query && !`${key} ${JSON.stringify(item)}`.toLowerCase().includes(query)) return null

      if (item && typeof item === 'object') {
        const label = Array.isArray(value)
          ? item.title || item.name || item.q || (Array.isArray(item) ? item.find(entry => typeof entry === 'string') : '') || `Card ${Number(key) + 1}`
          : getFieldLabel(path, key, Array.isArray(value))

        return (
          <details key={key} className="admin-content-group" open={query ? true : undefined}>
            <summary>
              {label}
              <small>{Array.isArray(item) ? `${item.length} entries · layout preserved` : 'Edit content'}</small>
            </summary>
            <div>
              <ContentFields
                value={item}
                path={next}
                onChange={onChange}
                onImage={onImage}
                query={query}
              />
            </div>
          </details>
        )
      }

      const isImage = typeof item === 'string' && /\.(png|jpe?g|webp|svg|gif)(\?.*)?$/i.test(item)
      const fieldTitle = getFieldLabel(path, key, Array.isArray(value))

      return (
        <label className="admin-content-field" key={key}>
          <span>{fieldTitle}</span>
          {typeof item === 'boolean' ? (
            <input
              type="checkbox"
              checked={item}
              onChange={event => onChange(nextForState, event.target.checked)}
            />
          ) : typeof item === 'number' ? (
            <input
              type="number"
              value={item}
              onChange={event => onChange(nextForState, Number(event.target.value))}
            />
          ) : (
            <>
              <textarea
                rows={item.length > 180 ? 4 : item.length > 70 ? 2 : 1}
                value={item}
                onChange={event => onChange(nextForState, event.target.value)}
              />
              {isImage && (
                <div className="admin-content-image">
                  {item.startsWith('/') || item.startsWith('http') ? (
                    <img src={item} alt="Current selection" loading="lazy" />
                  ) : null}
                  <button
                    className="admin-button secondary"
                    type="button"
                    onClick={() => onImage(next)}
                  >
                    <ImagePlus size={15} />
                    Choose image
                  </button>
                </div>
              )}
            </>
          )}
        </label>
      )
    })
  }
  return null
}

