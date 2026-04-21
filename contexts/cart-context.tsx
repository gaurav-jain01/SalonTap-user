import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { cartService } from '@/services/cartService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  name: string;
  price: number; // Sale Price
  regularPrice?: number; // Regular Price
  image: any;
  quantity: number;
  duration?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  suggestions: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateSuggestions: (items: any[]) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  totalDuration: number;
  couponCode?: string;
  discountAmount?: number;
  serverTotal?: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [suggestions, setSuggestions] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [discountAmount, setDiscountAmount] = useState<number | undefined>();
  const [serverTotal, setServerTotal] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await cartService.getCart();
      // Handle both wrapped {success, data} and direct cart object
      const data = res.data || res;
      
      if (data && data.items) {
        const formatted = data.items.map((item: any) => {
          const service = item.service || {};
          const serviceId = service._id || (typeof service === 'string' ? service : '');
          
          return {
            id: serviceId,
            name: service.name || 'Service',
            price: item.priceAtAdd?.salePrice || item.price || 0,
            regularPrice: item.priceAtAdd?.regularPrice || item.regularPrice,
            image: (service.images && service.images.length > 0) ? service.images[0] : null,
            quantity: item.quantity || 0,
            duration: service.duration || 0
          };
        });
        setCartItems(formatted);
        setCouponCode(data.couponCode);
        setDiscountAmount(data.discountAmount);
        setServerTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    const token = await AsyncStorage.getItem('token');
    if (!token || token === 'null') {
      console.log('Login required to add to cart');
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.addToCart(item.id, 1);
      if (res.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      setLoading(true);
      const res = await cartService.removeFromCart(id);
      if (res.success) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSuggestions = (items: any[]) => {
    const formatted = items.map(item => ({
      id: item._id,
      name: item.name,
      price: item.salePrice,
      regularPrice: item.regularPrice,
      image: item.images && item.images.length > 0 ? item.images[0] : null,
      quantity: 0,
      duration: item.duration || 0
    }));
    setSuggestions(formatted);
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.clearCart();
      if (res.success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDuration = cartItems.reduce((sum, item) => sum + (item.duration || 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        suggestions,
        addToCart,
        removeFromCart,
        updateSuggestions,
        clearCart,
        totalItems,
        totalAmount,
        totalDuration,
        couponCode,
        discountAmount,
        serverTotal,
        loading,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
