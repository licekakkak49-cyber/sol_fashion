import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isWishlistPopupOpen, setIsWishlistPopupOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

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
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
