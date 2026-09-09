import { ExternalLink, ImagePlus, Save, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { apiRequest } from '../api/client.js'
import { DataState, Modal, useAdminData } from './AdminUI.jsx'
import MediaLibrary from './MediaLibrary.jsx'

const readable = text => String(text).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
const labels = { home: 'Homepage', settings: 'Store settings', footer: 'Footer & contact', header: 'Header & navigation', articles: 'Wellness articles', policy: 'Shipping, returns & policies', 'vital-infinity-product': 'Vital Infinity layout' }
function replaceValue(root, path, value) {
  const copy = structuredClone(root)
  let node = copy
  path.slice(0, -1).forEach(key => { node = node[key] })
  node[path.at(-1)] = value
  return copy
}
export default function ContentPanel({ settingsOnly = false }) {
  const { data, setData, loading, error, reload } = useAdminData('/admin/content')
  const [selected, setSelected] = useState(settingsOnly ? 'settings' : 'home')
  const [draft, setDraft] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const [imagePath, setImagePath] = useState(null)
  const page = data?.pages.find(item => item.key === selected)
  useEffect(() => { if (page) { setDraft(structuredClone(page.content)); setDirty(false) } }, [page])
  useEffect(() => {
    if (!dirty) return
    const handler = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])
  const change = (path, value) => { setDraft(current => replaceValue(current, path, value)); setDirty(true) }
  const select = key => { if (!dirty || window.confirm('Discard unsaved page edits?')) { setSelected(key); setQuery('') } }
  const save = async event => {
    event.preventDefault(); setSaving(true)
    try {
      const { page: updated } = await apiRequest(`/admin/content/${selected}`, { method: 'PUT', body: JSON.stringify({ content: draft, revision: page.revision }) })
      setData(current => ({ pages: current.pages.map(item => item.key === selected ? updated : item) }))
      window.dispatchEvent(new Event('site-content-updated'))
      toast.success('Website content updated'); setDirty(false)
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }
  return <DataState loading={loading} error={error} retry={reload}><div className={`admin-content-layout ${settingsOnly ? 'settings-only' : ''}`}>{!settingsOnly && <nav className="admin-content-nav" aria-label="Website pages"><strong>WEBSITE PAGES</strong>{data?.pages.filter(item => item.key !== 'settings').map(item => <button key={item.key} className={selected === item.key ? 'active' : ''} onClick={() => select(item.key)}>{labels[item.key] || readable(item.key)}</button>)}</nav>}<section className="admin-panel admin-content-editor"><div className="admin-panel-heading"><div><h2>{labels[selected] || readable(selected)}</h2><p>Edit content. Existing sections and card counts stay intact.</p></div><a href="/" target="_blank" rel="noreferrer" className="admin-text-button">View website <ExternalLink size={14} /></a></div><div className="admin-content-search"><label className="admin-search"><Search size={16} /><input placeholder="Find a section or text…" value={query} onChange={event => setQuery(event.target.value)} /></label></div>{draft && <form onSubmit={save}><div className="admin-content-fields"><ContentFields value={draft} path={[]} onChange={change} onImage={setImagePath} query={query.toLowerCase()} /></div><div className="admin-editor-footer"><span>{dirty ? 'You have unsaved changes' : `All changes saved · Revision ${page.revision}`}</span><button className="admin-button" disabled={saving || !dirty}><Save size={16} />{saving ? 'Saving…' : 'Save changes'}</button></div></form>}</section></div>{imagePath && <Modal title="Choose an image" onClose={() => setImagePath(null)} wide><div className="admin-modal-body"><MediaLibrary onSelect={url => {
    const previous = imagePath.reduce((node, key) => node[key], draft)
    change(imagePath, !previous.includes('/') && /\.(png|jpg|jpeg|webp|svg)$/i.test(previous) ? url.split('/').at(-1) : url)
    setImagePath(null)
  }} /></div></Modal>}</DataState>
}
function ContentFields({ value, path, onChange, onImage, query }) {
  if (value && typeof value === 'object') {
    if (value.$icon) return null
    return Object.entries(value).map(([key, item]) => {
      if (['$icon', 'position', 'scale', 'className'].includes(key)) return null
      const next = [...path, key]
      if (query && !`${key} ${JSON.stringify(item)}`.toLowerCase().includes(query)) return null
      if (item && typeof item === 'object') {
        const label = Array.isArray(value) ? item.title || item.name || item.q || (Array.isArray(item) ? item.find(entry => typeof entry === 'string') : '') || `Card ${Number(key) + 1}` : readable(key)
        return <details key={key} className="admin-content-group" open={query ? true : undefined}><summary>{label}<small>{Array.isArray(item) ? `${item.length} entries · layout preserved` : 'Edit content'}</small></summary><div><ContentFields value={item} path={next} onChange={onChange} onImage={onImage} query={query} /></div></details>
      }
      const isImage = typeof item === 'string' && /\.(png|jpe?g|webp|svg|gif)(\?.*)?$/i.test(item)
      return <label className="admin-content-field" key={key}><span>{Array.isArray(value) ? `Field ${Number(key) + 1}` : readable(key)}</span>{typeof item === 'boolean' ? <input type="checkbox" checked={item} onChange={event => onChange(next, event.target.checked)} /> : typeof item === 'number' ? <input type="number" value={item} onChange={event => onChange(next, Number(event.target.value))} /> : <><textarea rows={item.length > 180 ? 4 : item.length > 70 ? 2 : 1} value={item} onChange={event => onChange(next, event.target.value)} />{isImage && <div className="admin-content-image">{item.startsWith('/') || item.startsWith('http') ? <img src={item} alt="Current selection" loading="lazy" /> : null}<button className="admin-button secondary" type="button" onClick={() => onImage(next)}><ImagePlus size={15} />Choose image</button></div>}</>}</label>
    })
  }
  return null
}
