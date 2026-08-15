import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './CartSidebar.module.css';

const CartSidebar = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal, formatPrice } = useCart();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  const getFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // Assume 2 days from now
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className={styles.sidebarOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={styles.sidebarContainer}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.topSection}>
              <div className={styles.header}>
                <div className={styles.innerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className={styles.title}>
                    Shopping cart{cartItems.length > 0 && <sup>{cartItems.length}</sup>}
                  </h2>
                  <button className={styles.closeBtn} onClick={closeCart} aria-label="Close Cart">
                    <X size={24} strokeWidth={1} />
                  </button>
                </div>
              </div>

            <div className={styles.scrollArea}>
              <div className={`${styles.innerContent} ${styles.cartItemsList}`} style={{ flex: cartItems.length === 0 ? 1 : 'none' }}>
                {cartItems.length === 0 ? (
                  <div className={styles.emptyState}>Your cart is empty</div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className={styles.item}>
                      <div className={styles.itemTop}>
                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                        <div className={styles.itemDetails}>
                          <div className={styles.itemHeaderRow}>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            <span className={styles.itemPrice}>{item.price}</span>
                          </div>
                          <div className={styles.itemMeta}>
                            {/* We don't have color in product object right now, hardcoding mock color if needed, or omit */}
                            <p className={styles.metaText}>Dark Brown</p> 
                            {item.size && <p className={styles.metaText}>Size {item.size}</p>}
                          </div>

                          <div className={styles.itemActions}>
                            <div className={styles.qtySelector}>
                              <button 
                                className={styles.qtyBtn}
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span>Qty {item.quantity}</span>
                              <button 
                                className={styles.qtyBtn}
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            
                            <button 
                              className={`${styles.actionLink} ${styles.removeLink}`}
                              onClick={() => removeFromCart(item.id, item.size)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className={styles.deliveryEstimate}>
                        Estimated delivery date: from {getFutureDate()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>

            {cartItems.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.innerContent}>
                  <div className={styles.totalRow}>
                    <div className={styles.totalLabel}>
                      <h3 className={styles.totalTitle}>TOTAL</h3>
                      <p className={styles.vatText}>VAT Included</p>
                    </div>
                    <div className={styles.totalPrice}>
                      {formatPrice(cartTotal)}
                    </div>
                  </div>
                  
                  <button className={styles.checkoutBtn}>
                    PROCEED TO CHECKOUT
                  </button>
                  
                  <p className={styles.termsText}>
                    By proceeding, you agree to SOL's <a href="#" className={styles.termsLink}>Terms of Service</a> and <a href="#" className={styles.termsLink}>Privacy Policy</a>.
                  </p>
                  
                  <button className={styles.viewCartBtn}>
                    VIEW MY SHOPPING CART
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
