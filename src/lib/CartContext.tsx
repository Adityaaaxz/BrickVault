"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CartContextType = {
  cartCount: number;
  addToCart: () => void;
};

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  addToCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => setCartCount((prev) => prev + 1);

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
