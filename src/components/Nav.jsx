import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Nav.module.css';

const menuData = {
  'BRAND': ['LINDBERG', 'MAUI JIM', 'GUCCI', 'CARTIER', 'SAINT LAURENT', 'BOTTEGA VENETA', 'BALENCIAGA', 'MCQUEEN', 'VALENTINO', 'CHLOÉ', 'ALAÏA', 'MONTBLANC', 'DUNHILL', 'ZEAL OPTICS', 'PUMA'],
  'ABOUT': ['OUR STORY', 'PHILOSOPHY', 'SUSTAINABILITY', 'MOREYES THROUGH THEIR EYES'],
  'JOIN US': ['OUR PEOPLE', 'CAREERS'],
  'NEWSROOM': ['PRESS RELEASES', 'EVENTS', 'MEDIA KIT']
};

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // Initially no submenu shown

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
        // Reset active menu when closing
        setActiveMenu(null);
    }
  };

  return (
    <>
      <nav className={styles.nav} style={{
        // Increase glassmorphism effect slightly when scrolled
        background: scrolled ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.05)' : 'none'
      }}>
        <div className={styles.left}>
          <button 
            className={`${styles.menuBtn} ${isMenuOpen ? styles.menuOpen : ''}`} 
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={styles.center}>
          <a href="/" className={styles.logo}>
            <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/Artboard%202.svg" alt="Moreyes Logo" />
          </a>
        </div>

        <div className={styles.right}>
          <button className={styles.iconBtn} aria-label="Search">
            <Search size={42} strokeWidth={0.5} />
          </button>
          <button className={styles.langBtn} aria-label="Language">
            EN <svg width="16" height="10" viewBox="0 0 18 11" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}><polyline points="1 1 9 10 17 1" /></svg>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.645, 0.045, 0.355, 1.000] }}
            className={styles.menuOverlay}
          >
            <div className={styles.menuContainer}>
              {/* Left Side: Main Categories */}
              <div className={styles.menuLeft}>
                <ul className={styles.mainMenuList}>
                  {Object.keys(menuData).map((item) => (
                    <li key={item}>
                      <button
                        className={`${styles.mainMenuBtn} ${activeMenu === item ? styles.active : ''}`}
                        onMouseEnter={() => setActiveMenu(item)}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Vertical Divider */}
              <div className={styles.menuDivider}></div>

              {/* Right Side: Sub Categories */}
              <div className={styles.menuRight}>
                <AnimatePresence mode="wait">
                  {activeMenu && (
                    <motion.ul 
                      key={activeMenu}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className={styles.subMenuList}
                    >
                      {menuData[activeMenu].map((subItem) => (
                        <li key={subItem}>
                          <a href={`#${subItem.toLowerCase().replace(/\s+/g, '-')}`} className={styles.subMenuLink}>
                            {subItem}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
