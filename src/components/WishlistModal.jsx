import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import styles from './WishlistModal.module.css';

const WishlistModal = () => {
  const { isWishlistOpen, closeWishlist, wishlistItems, toggleWishlist } = useWishlist();

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          WISHLIST{wishlistItems.length > 0 && <sup>{wishlistItems.length}</sup>}
        </h2>
        <button className={styles.closeBtn} onClick={closeWishlist} aria-label="Close Wishlist">
          <X size={24} strokeWidth={1} />
        </button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={styles.emptyState}>
          Your wishlist is empty.
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {wishlistItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.imageContainer}>
                  <img src={item.image} alt={item.name} className={styles.image} />
                </div>
                <div className={styles.details}>
                  <div className={styles.info}>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.color}>Silver / Clear</p>
                    <p className={styles.price}>
                      {item.price} {item.status && <span>- {item.status}</span>}
                    </p>
                  </div>
                  <button 
                    className={styles.bookmarkBtn} 
                    onClick={() => toggleWishlist(item)}
                    aria-label="Remove from Wishlist"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
                      <path d="M19 21l-7-5-7 5V3h14v18z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.footer}>
            <button 
              className={styles.chatWithStylistBtn}
              onClick={() => {
                const itemList = wishlistItems.map(item => `- ${item.name} (${item.price})`).join('\n');
                const message = `สวัสดีค่ะ สนใจแว่นตามรายการนี้ค่ะ:\n${itemList}`;
                window.open(`https://line.me/R/oaMessage/@moreyes/?text=${encodeURIComponent(message)}`, '_blank');
              }}
            >
              <div className={styles.lineCircle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.967C23.156 14.375 24 12.459 24 10.314" />
                </svg>
              </div>
              CHAT WITH STYLIST
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistModal;
