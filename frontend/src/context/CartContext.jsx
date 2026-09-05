import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('divyaSwasthCart')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('divyaSwasthCart', JSON.stringify(items))
  }, [items])

  const addToCart = (product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item._id === product._id)
      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.countInStock) }
            : item,
        )
      }
      return [...current, { ...product, quantity: Math.min(quantity, product.countInStock) }]
    })
    toast.success(`${product.name} added to your cart`)
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return
    setItems((current) =>
      current.map((item) =>
        item._id === id ? { ...item, quantity: Math.min(quantity, item.countInStock) } : item,
      ),
    )
  }

  const removeFromCart = (id) => {
    setItems((current) => current.filter((item) => item._id !== id))
    toast.success('Item removed')
  }

  const clearCart = () => setItems([])
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = { items, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
