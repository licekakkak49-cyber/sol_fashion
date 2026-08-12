import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import styles from './WishlistModal.module.css';

const WishlistModal = () => {
  const { isWishlistOpen, closeWishlist, wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sizeErrors, setSizeErrors] = useState({});
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    return () => {
      Object.values(addingToCart).forEach(clearTimeout);
    };
  }, [addingToCart]);

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

  // Mock sizes based on product name
  const getItemSizes = (itemName) => {
    const lower = itemName.toLowerCase();
    if (lower.includes('dress') || lower.includes('top') || lower.includes('skirt') || lower.includes('bikini')) {
      return ['34', '36', '38', '40'];
    }
    return null; 
  };

  const handleSizeChange = (itemId, size) => {
    setSelectedSizes(prev => ({ ...prev, [itemId]: size }));
    setSizeErrors(prev => ({ ...prev, [itemId]: false })); 
  };

  const handleAddToCart = (item) => {
    const sizes = getItemSizes(item.name);
    if (sizes && !selectedSizes[item.id]) {
      setSizeErrors(prev => ({ ...prev, [item.id]: true }));
      return;
    }
    
    // Add item to cart context
    addToCart(item, selectedSizes[item.id]);

    // Start timeout for auto-remove
    const timeoutId = setTimeout(() => {
      toggleWishlist(item);
      setAddingToCart(prev => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }, 3000);
    
    setAddingToCart(prev => ({ ...prev, [item.id]: timeoutId }));
  };

  const handleCancelAdd = (itemId) => {
    if (addingToCart[itemId]) {
      clearTimeout(addingToCart[itemId]);
      setAddingToCart(prev => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }
  };

  if (!isWishlistOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Wishlist{wishlistItems.length > 0 && <sup>{wishlistItems.length}</sup>}
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
                {addingToCart[item.id] ? (
                  <div className={styles.addedSuccessBlock}>
                    <p className={styles.successMessage}>
                      Added to your <Link to="/cart" className={styles.cartLink} onClick={closeWishlist}>cart</Link>
                    </p>
                    <button className={styles.textBtn} onClick={() => handleCancelAdd(item.id)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className={styles.imageContainer}>
                      <img src={item.image} alt={item.name} className={styles.image} />
                    </div>
                    
                    <div className={styles.itemContent}>
                      <div className={styles.itemInfo}>
                        <p className={styles.name}>{item.name}</p>
                        <p className={styles.color}>Black</p> {/* Mocking color for reference */}
                      </div>
                      
                      {getItemSizes(item.name) && (
                        <div className={`${styles.sizeWrapper} ${sizeErrors[item.id] ? styles.sizeError : ''}`}>
                          <select 
                            className={styles.sizeDropdown}
                            value={selectedSizes[item.id] || ''}
                            onChange={(e) => handleSizeChange(item.id, e.target.value)}
                          >
                            <option value="" disabled hidden>Size ⌄</option>
                            {getItemSizes(item.name).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className={styles.itemFooter}>
                        <p className={styles.price}>
                          {item.price} {item.status && <span>- {item.status}</span>}
                        </p>
                        <div className={styles.itemActions}>
                          <button className={styles.textBtn} onClick={() => handleAddToCart(item)}>Add to cart</button>
                          <button className={styles.textBtn} onClick={() => toggleWishlist(item)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          
          <div className={styles.footer}>
            <button 
              className={styles.mainActionBtn}
              onClick={() => {
                // Add all valid items to cart
                wishlistItems.forEach(item => {
                  const size = selectedSizes[item.id] || "M"; // Default to M or require validation
                  addToCart(item, size);
                });
                closeWishlist();
              }}
            >
              ADD ALL TO CART
            </button>
            <button className={styles.shareLink}>Share my wishlist</button>
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistModal;
