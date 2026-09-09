import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../api/client.js'
import { fallbackProducts } from '../data/products.js'

const validSlugs = new Set(fallbackProducts.map(p => p.slug))

const ProductContext = createContext({ products: fallbackProducts, loading: true, error: '' })

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const first = await apiRequest('/products?limit=50')
      const all = [...(first?.products || [])]
      for (let page = 2; page <= (first?.pages || 1); page++) {
        const next = await apiRequest(`/products?limit=50&page=${page}`)
        all.push(...(next?.products || []))
      }
      const filtered = all.filter(p => validSlugs.has(p.slug) && p.isActive !== false)
      setProducts(filtered.length ? filtered : fallbackProducts)
      setError('')
    } catch (err) {
      setError(err.message)
      setProducts(fallbackProducts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('focus', refresh)
    window.addEventListener('products-updated', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('products-updated', refresh)
    }
  }, [refresh])

  return (
    <ProductContext.Provider value={{ products, loading, error, refresh }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductCatalog = () => useContext(ProductContext)
