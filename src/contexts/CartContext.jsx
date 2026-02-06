// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth(); // lấy từ AuthContext
  const [cart, setCart] = useState([]);

  const refreshCart = async () => {
    if (!user?.id) {
      setCart([]);
      return;
    }
    try {
      const res = await cartService.getCart(user.id);
      const data = res.data?.data ?? res.data;
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load cart", err);
      setCart([]);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user?.id]); // khi user đổi -> refresh

  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}
