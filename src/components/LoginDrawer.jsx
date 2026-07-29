import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAdmin } from '../context/AdminContext';
import styles from './LoginDrawer.module.css';

const LoginDrawer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('signIn');
  const { wishlistItems, openWishlist } = useWishlist();
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Check for Admin Login
    if (e && e.target && e.target.elements) {
      const email = e.target.elements.email?.value;
      const password = e.target.elements.password?.value;
      
      if (activeTab === 'signIn' && email && password) {
        const isSuccess = loginAdmin(email, password);
        if (isSuccess) {
          onClose();
          navigate('/admin');
          return;
        }
      }
    }

    onClose();
    navigate('/account');
  };

  const handleMoreClick = () => {
    onClose();
    openWishlist();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
          >
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={20} strokeWidth={1} />
            </button>
            
            <div className={styles.content}>
              <h2 className={styles.title}>My Account</h2>
              
              <div className={styles.tabs}>
                <button 
                  className={`${styles.tab} ${activeTab === 'signIn' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('signIn')}
                >
                  Sign In
                </button>
                <button 
                  className={`${styles.tab} ${activeTab === 'newCustomer' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('newCustomer')}
                >
                  New customer
                </button>
              </div>
              
              <form className={styles.form} onSubmit={handleLogin}>
                {activeTab === 'newCustomer' && (
                  <>
                    <div className={styles.inputGroup}>
                      <input type="text" name="firstName" placeholder="First name" className={styles.input} autoComplete="given-name" />
                    </div>
                    <div className={styles.inputGroup}>
                      <input type="text" name="lastName" placeholder="Last name" className={styles.input} autoComplete="family-name" />
                    </div>
                  </>
                )}
                
                <div className={styles.inputGroup}>
                  <input type="email" name="email" placeholder="Email" className={styles.input} autoComplete="email" />
                </div>
                
                <div className={styles.inputGroup}>
                  <input type="password" name="password" placeholder="Password" className={styles.input} autoComplete={activeTab === 'signIn' ? "current-password" : "new-password"} />
                  {activeTab === 'signIn' && (
                    <a href="#" className={styles.forgotPassword}>Forgot your password?</a>
                  )}
                </div>
                
                <button type="submit" className={styles.loginBtn}>
                  {activeTab === 'signIn' ? 'Login' : 'Create'}
                </button>
              </form>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <button className={styles.googleBtn} onClick={handleLogin}>
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                CONTINUE WITH GOOGLE
              </button>

              <div className={styles.wishlistSection}>
                <div className={styles.wishlistHeader}>
                  <h3>WISHLIST{wishlistItems.length > 0 && <sup>{wishlistItems.length}</sup>}</h3>
                  <button onClick={handleMoreClick} className={styles.moreBtn}>MORE</button>
                </div>
                <div className={styles.wishlistGrid}>
                  {wishlistItems.slice(-3).reverse().map(item => (
                    <div key={item.id} className={styles.wishlistItem}>
                      <img src={item.image} alt={item.name} />
                      <p className={styles.wishlistName}>{item.name}</p>
                      <p className={styles.wishlistPrice}>{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginDrawer;
