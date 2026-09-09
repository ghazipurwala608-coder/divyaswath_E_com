import { AlertCircle, LoaderCircle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../api/client.js'

export const currency = value => `₹${Number(value || 0).toLocaleString('en-IN')}`
export const date = value => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
export function useAdminData(endpoint) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    apiRequest(endpoint).then(result => { if (active) setData(result) }).catch(err => { if (active) setError(err.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [endpoint, revision])
  return { data, setData, loading, error, reload: () => setRevision(value => value + 1) }
}
export function DataState({ loading, error, retry, children }) {
  if (loading) return <div className="admin-state"><LoaderCircle className="animate-spin" /><p>Loading your store…</p></div>
  if (error) return <div className="admin-state" role="alert"><AlertCircle /><p>{error}</p><button className="admin-button secondary" onClick={retry}>Try again</button></div>
  return children
}
export function EmptyState({ title, text }) {
  return <div className="admin-state"><p className="admin-empty-title">{title}</p><p>{text}</p></div>
}
export function Badge({ children, tone = '' }) { return <span className={`admin-badge ${tone}`}>{children}</span> }
export function Modal({ title, children, onClose, wide = false }) {
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement
    const handler = event => {
      if (event.key === 'Escape') close.current()
      if (event.key === 'Tab') {
        const elements = [...document.querySelectorAll('.admin-modal button, .admin-modal input, .admin-modal textarea, .admin-modal select, .admin-modal a')].filter(element => !element.disabled && element.getClientRects().length)
        const first = elements[0], last = elements.at(-1)
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', handler)
    document.querySelector('.admin-modal button')?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = overflow; previous?.focus() }
  }, [])
  return <div className="admin-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section className={`admin-modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button aria-label="Close dialog" onClick={onClose}><X size={20} /></button></header>{children}</section></div>
}
