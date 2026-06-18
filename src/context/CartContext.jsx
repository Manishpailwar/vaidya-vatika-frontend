import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()
const STORAGE_KEY = 'vv_cart'

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i.id === action.item.id)
      const stock = action.item.stock ?? Infinity
      if (exists) {
        const newQty = exists.qty + (action.qty || 1)
        return state.map(i =>
          i.id === action.item.id ? { ...i, qty: Math.min(newQty, stock) } : i
        )
      }
      return [...state, { ...action.item, qty: Math.min(action.qty || 1, stock) }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY': {
      const item = state.find(i => i.id === action.id)
      const stock = item?.stock ?? Infinity
      return state.map(i =>
        i.id === action.id ? { ...i, qty: Math.min(Math.max(1, action.qty), stock) } : i
      )
    }
    case 'CLEAR':
      return []
    default:
      return state
  }
}

// FIXED: Read initial cart from localStorage so it survives page refresh.
function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart)

  // FIXED: Every time the cart changes, save it to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // localStorage quota exceeded — fail silently
    }
  }, [cart])

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)