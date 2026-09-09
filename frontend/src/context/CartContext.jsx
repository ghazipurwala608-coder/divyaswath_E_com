import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useProducts } from '../hooks/useProducts.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { products } = useProducts()
  const [storedItems, setItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('divyaSwasthCart'))
      return Array.isArray(saved) ? saved.filter(item => item && typeof item.slug === 'string' && Number.isInteger(item.quantity) && item.quantity > 0) : []
    } catch {
      return []
    }
  })
  const items = storedItems.map(item => ({ ...item, ...products.find(product => product.slug === item.slug), quantity: item.quantity }))

  useEffect(() => {
    localStorage.setItem('divyaSwasthCart', JSON.stringify(storedItems))
  }, [storedItems])

  const addToCart = (product, quantity = 1) => {
    if (product.availableForPurchase === false || product.countInStock < 1 || product.price <= 0) return toast.error('This product is not available for purchase yet')
    if (!Number.isInteger(quantity) || quantity < 1) return
    setItems((current) => {
      const existing = current.find((item) => item.slug === product.slug)
      if (existing) {
        return current.map((item) =>
          item.slug === product.slug
            ? { ...product, quantity: Math.min(item.quantity + quantity, product.countInStock, 10) }
            : item,
        )
      }
      return [...current, { ...product, quantity: Math.min(quantity, product.countInStock, 10) }]
    })
    toast.success(`${product.name} added to your cart`)
  }

  const updateQuantity = (id, quantity) => {
    const selected = items.find(item => item._id === id)
    if (!selected || quantity < 1 || !Number.isInteger(quantity) || selected.countInStock < 1) return
    setItems((current) =>
      current.map((item) =>
        item.slug === selected.slug ? { ...item, quantity: Math.min(quantity, selected.countInStock, 10) } : item,
      ),
    )
  }

  const removeFromCart = (id) => {
    const selected = items.find(item => item._id === id)
    setItems((current) => current.filter((item) => item.slug !== selected?.slug))
    toast.success('Item removed')
  }

  const clearCart = () => setItems([])
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = { items, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
