'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Service } from '@/types/services';

interface CartContextType {
  selectedServices: Service[];
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalDuration: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on mount to avoid server-client mismatch
  useEffect(() => {
    const saved = localStorage.getItem('blades-cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedServices(parsed);
        }
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('blades-cart', JSON.stringify(selectedServices));
    }
  }, [selectedServices, isLoaded]);

  const addService = (service: Service) => {
    setSelectedServices(prev => {
      if (prev.find(s => s.id === service.id)) return prev;
      return [...prev, service];
    });
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const clearCart = () => {
    setSelectedServices([]);
  };

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, s) => {
      const minutes = parseInt(s.duration.split(' ')[0]) || 0;
      return sum + minutes;
    }, 0);
  }, [selectedServices]);

  return (
    <CartContext.Provider value={{
      selectedServices,
      addService,
      removeService,
      clearCart,
      totalPrice,
      totalDuration
    }}>
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
