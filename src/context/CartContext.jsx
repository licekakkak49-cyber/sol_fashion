import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart items");
      }
    }
  }, []);

  // Save to local storage when cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, size = null, quantity = 1) => {
    setCartItems(prev => {
      // Check if item with same ID and size exists
      const existingItemIndex = prev.findIndex(item => item.id === product.id && item.size === size);
      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }
      return [...prev, { ...product, size, quantity }];
    });
    openCart();
  };

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        (item.id === id && item.size === size) ? { ...item, quantity } : item
      )
    );
  };

  // Helper to parse price string (e.g. "1 570 USD" -> 1570)
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    // Remove non-digit characters except dots (assuming USD, standard formatting)
    const numericStr = priceStr.toString().replace(/[^0-9.]/g, '');
    return parseFloat(numericStr) || 0;
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (parsePrice(item.price) * item.quantity);
  }, 0);

  const formatPrice = (amount) => {
    // Format to look like "6 185 USD"
    return new Intl.NumberFormat('en-US', { 
      maximumFractionDigits: 0,
      useGrouping: true 
    }).format(amount).replace(/,/g, ' ') + ' USD';
  };

  const value = {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    formatPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
