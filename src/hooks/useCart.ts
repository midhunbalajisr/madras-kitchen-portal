import { useState, useEffect, useCallback } from 'react';
import { getCart, saveCart, type CartItem } from '@/lib/storage';

// Custom event for cart updates
const CART_UPDATE_EVENT = 'madras_kitchen_cart_update';

export const dispatchCartUpdate = () => {
  window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT));
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = useCallback(() => {
    const cartData = getCart();
    setCart(cartData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCart();
    
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);
    return () => window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
  }, [loadCart]);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    const currentCart = getCart();
    if (newQuantity <= 0) {
      const filtered = currentCart.filter(item => item.id !== itemId);
      saveCart(filtered);
    } else {
      const item = currentCart.find(i => i.id === itemId);
      if (item) {
        item.quantity = newQuantity;
        saveCart(currentCart);
      }
    }
    dispatchCartUpdate();
  }, []);

  const removeItem = useCallback((itemId: string) => {
    const filtered = getCart().filter(item => item.id !== itemId);
    saveCart(filtered);
    dispatchCartUpdate();
  }, []);

  const addItem = useCallback((item: CartItem) => {
    const currentCart = getCart();
    const existingItem = currentCart.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentCart.push(item);
    }
    saveCart(currentCart);
    dispatchCartUpdate();
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
    dispatchCartUpdate();
  }, []);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    isLoading,
    total,
    itemCount,
    updateQuantity,
    removeItem,
    addItem,
    clearCart,
    refresh: loadCart,
  };
};
