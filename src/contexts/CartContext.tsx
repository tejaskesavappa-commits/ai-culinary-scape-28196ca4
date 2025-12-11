import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Coupon } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
  appliedCoupon: Coupon | null;
  discount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState };

const calcDiscount = (coupon: Coupon | null, total: number): number => {
  if (!coupon) return 0;
  if (total < coupon.minOrder) return 0;
  let discount = 0;
  if (coupon.discount <= 100) {
    discount = (total * coupon.discount) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discount;
  }
  return discount;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        newState = {
          ...state,
          items: updatedItems,
          total: newTotal
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        newState = {
          ...state,
          items: newItems,
          total: newTotal
        };
      }
      break;
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      newState = {
        ...state,
        items: newItems,
        total: newTotal
      };
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== action.payload.id);
        const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        newState = {
          ...state,
          items: newItems,
          total: newTotal
        };
      } else {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        newState = {
          ...state,
          items: updatedItems,
          total: newTotal
        };
      }
      break;
    }

    case 'APPLY_COUPON': {
      const discount = calcDiscount(action.payload, state.total);
      newState = {
        ...state,
        appliedCoupon: action.payload,
        discount
      };
      break;
    }

    case 'REMOVE_COUPON': {
      newState = {
        ...state,
        appliedCoupon: null,
        discount: 0
      };
      break;
    }
    
    case 'CLEAR_CART':
      newState = { items: [], total: 0, appliedCoupon: null, discount: 0 };
      break;
    
    default:
      return state;
  }

  // Recalculate discount whenever cart changes
  if (newState.appliedCoupon) {
    newState.discount = calcDiscount(newState.appliedCoupon, newState.total);
  }

  return newState;
};

interface CartContextType {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'foodie-cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    appliedCoupon: null, 
    discount: 0 
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartState;
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }, []);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }, [cart]);

  // Cross-tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as CartState;
          dispatch({ type: 'HYDRATE', payload: parsed });
        } catch (error) {
          console.error('Failed to sync cart across tabs:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const applyCoupon = (coupon: Coupon) => {
    dispatch({ type: 'APPLY_COUPON', payload: coupon });
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, applyCoupon, removeCoupon, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};