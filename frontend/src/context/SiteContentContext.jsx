import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api/client.js'
import { websiteContent } from '../../../shared/websiteContent.js'

const SiteContentContext = createContext(null)
export function SiteContentProvider({ children }) {
  const [pages, setPages] = useState(websiteContent)
  const refresh = useCallback(async () => {
    try {
      const data = await apiRequest('/content')
      setPages({ ...websiteContent, ...data.pages })
    } catch { /* Keep the complete original design available during an API outage. */ }
  }, [])
  useEffect(() => {
    refresh()
    window.addEventListener('focus', refresh)
    window.addEventListener('site-content-updated', refresh)
    return () => { window.removeEventListener('focus', refresh); window.removeEventListener('site-content-updated', refresh) }
  }, [refresh])
  return <SiteContentContext.Provider value={pages}>{children}</SiteContentContext.Provider>
}
function hydrate(value, icons) {
  if (Array.isArray(value)) return value.map(item => hydrate(item, icons))
  if (value && typeof value === 'object') {
    if (value.$icon) return icons[value.$icon]
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, hydrate(item, icons)]))
  }
  return value
}
const noIcons = {}
export function useSiteContent(key, icons = noIcons) {
  const pages = useContext(SiteContentContext)
  const page = pages?.[key] || websiteContent[key]
  return useMemo(() => hydrate(page, icons), [page, icons])
}
