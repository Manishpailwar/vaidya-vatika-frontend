import { createContext, useContext, useReducer } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i.id === action.item.id)
      const stock = action.item.stock ?? Infinity
      if (exists) {
        const newQty = exists.qty + (action.qty || 1)
        if (newQty > stock) {
          // Signal to component — toast shown in component or here
          return state.map(i => i.id === action.item.id ? { ...i, qty: stock } : i)
        }
        return state.map(i => i.id === action.item.id ? { ...i, qty: newQty } : i)
      }
      const initialQty = Math.min(action.qty || 1, stock)
      return [...state, { ...action.item, qty: initialQty }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY': {
      const item = state.find(i => i.id === action.id)
      const stock = item?.stock ?? Infinity
      const clampedQty = Math.min(Math.max(1, action.qty), stock)
      return state.map(i => i.id === action.id ? { ...i, qty: clampedQty } : i)
    }
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [])
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)
  return (
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)