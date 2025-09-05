"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  manufacturer?: string;
  inStock: boolean;
}

export interface FavoriteItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  image?: string;
  manufacturer?: string;
  inStock: boolean;
}

interface CartState {
  items: CartItem[];
  favorites: FavoriteItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_FAVORITES'; payload: FavoriteItem }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: { id: string } }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  favorites: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };
    
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    
    case 'ADD_TO_FAVORITES': {
      const existingFavorite = state.favorites.find(item => item.id === action.payload.id);
      if (existingFavorite) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    }
    
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(item => item.id !== action.payload.id),
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen,
      };
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleCart: (open?: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('dealer-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dealer-cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addToFavorites = (item: FavoriteItem) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: item });
  };

  const removeFromFavorites = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: { id } });
  };

  const isFavorite = (id: string) => {
    return state.favorites.some(item => item.id === id);
  };

  const toggleCart = (open?: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: open });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}