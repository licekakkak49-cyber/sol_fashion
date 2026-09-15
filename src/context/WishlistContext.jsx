import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isWishlistPopupOpen, setIsWishlistPopupOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sol_wishlist_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist to localStorage whenever wishlistItems changes
  useEffect(() => {
    try {
      localStorage.setItem('sol_wishlist_items', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistItems]);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const openWishlistPopup = (item) => {
    setLastAddedItem(item);
    setIsWishlistPopupOpen(true);
  };
  const closeWishlistPopup = () => setIsWishlistPopupOpen(false);

  const toggleWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const isAlreadyInWishlist = prevItems.some((item) => item.id === product.id);
      if (isAlreadyInWishlist) {
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        return [...prevItems, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        isWishlistPopupOpen,
        lastAddedItem,
        openWishlistPopup,
        closeWishlistPopup,
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
