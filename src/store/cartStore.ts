import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity) => {
    const { items } = get();
    const existingItem = items.find((item) => item.product._id === product._id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        ),
      });
    } else {
      set({ items: [...items, { product, quantity }] });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.product._id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalAmount: () => {
    return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
