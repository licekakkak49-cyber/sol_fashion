import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import styles from './WishlistPopup.module.css';

const WishlistPopup = () => {
  const { isWishlistPopupOpen, closeWishlistPopup, wishlistItems, lastAddedItem, openWishlist } = useWishlist();

  useEffect(() => {
    if (isWishlistPopupOpen) {
      const timer = setTimeout(() => {
        closeWishlistPopup();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isWishlistPopupOpen, closeWishlistPopup]);

  const handleViewWishlist = () => {
    closeWishlistPopup();
    openWishlist();
  };

  return (
    <AnimatePresence>
      {isWishlistPopupOpen && (
        <motion.div 
          className={styles.popupContainer}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <button className={styles.closeBtn} onClick={closeWishlistPopup} aria-label="Close Popup">
            <X size={20} strokeWidth={1.2} />
          </button>

          {lastAddedItem && (
            <p className={styles.addedText}>
              {lastAddedItem.name} has been saved to your wishlist.
            </p>
          )}
          
          <h3 className={styles.title}>Wishlist{wishlistItems.length > 0 && <sup>{wishlistItems.length}</sup>}</h3>
          
          <div className={styles.itemsList}>
            {wishlistItems.slice(-3).reverse().map(item => (
              <div key={item.id} className={styles.item}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemPrice}>{item.price}</p>
              </div>
            ))}
          </div>

          <button className={styles.viewBtn} onClick={handleViewWishlist}>
            VIEW WISHLIST
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishlistPopup;
