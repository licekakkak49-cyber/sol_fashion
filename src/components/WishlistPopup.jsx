import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import styles from './WishlistPopup.module.css';

const WishlistPopup = () => {
  const { isWishlistPopupOpen, closeWishlistPopup, openWishlist } = useWishlist();

  useEffect(() => {
    if (isWishlistPopupOpen) {
      const timer = setTimeout(() => {
        closeWishlistPopup();
      }, 4000);
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
          className={styles.popupWrapper}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className={styles.popupContainer}>
            <span className={styles.message}>
              The product has been added to your wishlist.
            </span>
            <button className={styles.viewBtn} onClick={handleViewWishlist}>
              View
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishlistPopup;
