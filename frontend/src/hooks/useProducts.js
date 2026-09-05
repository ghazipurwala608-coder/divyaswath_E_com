import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client.js'
import { fallbackProducts } from '../data/products.js'

export function useProducts() {
  const [products, setProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    apiRequest('/products?limit=50')
      .then((data) => {
        if (active && data.products?.length) setProducts(data.products)
      })
      .catch(() => {})
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  return { products, loading }
}

