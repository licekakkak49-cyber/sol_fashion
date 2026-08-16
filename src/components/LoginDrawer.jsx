import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import styles from './LoginDrawer.module.css';

const LoginDrawer = ({ isOpen, onClose }) => {
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (activeTab === 'login') {
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const password = formData.get('password');
      
      if (loginAdmin(email, password)) {
        onClose();
        navigate('/admin');
        return;
      }
    }
    
    onClose();
    navigate('/account');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={styles.drawer}
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <div className={styles.innerContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className={styles.title}>Account</h2>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                  <X size={24} strokeWidth={1} />
                </button>
              </div>
            </div>
            
            <div className={styles.scrollArea}>
              <div className={styles.innerContent}>
                
                <div className={styles.tabs}>
                  <button 
                    className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </button>
                  <button 
                    className={`${styles.tab} ${activeTab === 'create' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('create')}
                  >
                    Create an account
                  </button>
                </div>
                
                <form className={styles.form} onSubmit={handleLogin}>
                  {activeTab === 'create' && (
                    <>
                      <div className={styles.inputGroup}>
                        <input 
                          type="text" 
                          name="firstName" 
                          placeholder="First name *" 
                          className={styles.input} 
                          required 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <input 
                          type="text" 
                          name="lastName" 
                          placeholder="Last name *" 
                          className={styles.input} 
                          required 
                        />
                      </div>
                    </>
                  )}
                  <div className={styles.inputGroup}>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Email *" 
                      className={styles.input} 
                      required 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <div className={styles.passwordInputWrapper}>
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password" 
                        placeholder="Password *" 
                        className={styles.input} 
                        required 
                      />
                      <button 
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                      </button>
                    </div>
                    {activeTab === 'login' && (
                      <a href="#" className={styles.forgotPassword}>Forgot your password?</a>
                    )}
                  </div>
                  
                  <button type="submit" className={styles.loginBtn}>
                    {activeTab === 'login' ? 'LOGIN' : 'CREATE AN ACCOUNT'}
                  </button>
                </form>

                <div className={styles.socialSection}>
                  <p className={styles.socialText}>Or connect with</p>
                  <button className={styles.googleBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    GOOGLE
                  </button>
                </div>
                
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginDrawer;
