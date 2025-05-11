import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const STORAGE_KEY = 'guest_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart items
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Load from Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);
        
        if (!error && data) {
          setItems(data);
        }
      } else {
        // Load from localStorage
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      }
    };

    loadCart();
  }, [user]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  // Merge guest cart with user cart on login
  useEffect(() => {
    const mergeGuestCart = async () => {
      if (user) {
        const guestCart = localStorage.getItem(STORAGE_KEY);
        if (guestCart) {
          const guestItems = JSON.parse(guestCart);
          for (const item of guestItems) {
            await addItem(item.product_id, item.quantity);
          }
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    };

    mergeGuestCart();
  }, [user]);

  const addItem = async (productId: string, quantity: number) => {
    if (user) {
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setItems(current => [...current, data]);
      }
    } else {
      setItems(current => [...current, {
        id: crypto.randomUUID(),
        product_id: productId,
        quantity
      }]);
    }
  };

  const removeItem = async (productId: string) => {
    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    }
    
    setItems(current => current.filter(item => item.product_id !== productId));
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    }

    setItems(current =>
      current.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    }
    
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};