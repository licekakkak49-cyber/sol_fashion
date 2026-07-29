import React, { useState, useEffect } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAdmin } from '../context/AdminContext';
import styles from './Nav.module.css';

const LineIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.967C23.156 14.375 24 12.459 24 10.314" />
  </svg>
);

const STATIC_MENU_DATA = {
  'ABOUT': ['OUR STORY', 'PHILOSOPHY', 'SUSTAINABILITY', 'MOREYES THROUGH THEIR EYES'],
  'JOIN US': ['OUR PEOPLE', 'CAREERS'],
  'NEWSROOM': ['PRESS RELEASES', 'EVENTS', 'MEDIA KIT']
};

const Nav = ({ isHomePage = false, onOpenLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { openWishlist } = useWishlist();
  const { brands, contentArticles } = useAdmin();

  // Filter and sort lenses articles
  const lensesArticles = (contentArticles || []).filter(a => a.category === 'lenses' && a.status === 'Published');
  const sortedLenses = [...lensesArticles].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Dynamically build menu data
  const menuData = {
    'BRAND': brands.map(b => ({ name: b.name, slug: b.slug })),
    'PRECISION LENSES': sortedLenses.map(l => ({ name: l.title, slug: l.id })),
    ...STATIC_MENU_DATA
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      setShowLogo(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
        setActiveMenu(null);
    }
  };

  const dropdownHeight = (activeDropdown === 'brands' || activeDropdown === 'lenses') ? 500 : 0;
  const navHeight = 80 + dropdownHeight;

  return (
    <>
      <nav 
        className={`${styles.nav} ${scrolled || activeDropdown ? styles.scrolled : ''} ${isHomePage ? styles.homeNav : ''} ${showLogo || activeDropdown ? styles.showLogo : ''}`}
        style={{ height: `${navHeight}px` }}
      >
        {/* Mobile Hamburger Button */}
        <button 
          className={styles.mobileMenuBtn} 
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>

        <div className={styles.left}>
          <ul className={styles.navLinks}>
            <li><a href="#">Sunglasses</a></li>
            <li><a href="/products">Glasses</a></li>
            <li 
              onMouseEnter={() => setActiveDropdown('brands')}
              onMouseLeave={() => setActiveDropdown(null)}
              className={styles.navItemWithDropdown}
            >
              <a href="/brand/gucci">Brands</a>
              {activeDropdown === 'brands' && (
                <div className={styles.megaMenu}>
                  <ul className={styles.megaMenuList}>
                    {menuData['BRAND'].map((brand) => (
                      <li key={brand.slug || brand.name}>
                        <a href={`/brand/${brand.slug}`}>
                          {brand.name.toLowerCase()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            <li 
              onMouseEnter={() => setActiveDropdown('lenses')}
              onMouseLeave={() => setActiveDropdown(null)}
              className={styles.navItemWithDropdown}
            >
              <Link to="/lenses">Precision Lenses</Link>
              {activeDropdown === 'lenses' && (
                <div className={styles.megaMenu}>
                  <ul className={styles.megaMenuList}>
                    {menuData['PRECISION LENSES'].map((lens) => (
                      <li key={lens.slug}>
                        <Link to={`/lenses/${lens.slug}`}>
                          {lens.name.toLowerCase()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            <li><a href="/store">Stores</a></li>
            <li>
              <Link to="/story">Explore</Link>
            </li>
          </ul>
        </div>

        <div className={styles.center}>
          <a href="/" className={styles.logo}>
            <img src="https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/Artboard%202.svg" alt="Moreyes Logo" />
          </a>
        </div>

        <div className={styles.right}>
          <div className={styles.iconGroup}>
            <button className={styles.iconBtn} aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button className={styles.iconBtn} aria-label="Profile" onClick={onOpenLogin}>
              <User size={18} strokeWidth={1.5} />
            </button>
            <a href="https://line.me" target="_blank" rel="noopener noreferrer" className={styles.lineBtn} aria-label="Contact via Line">
              <LineIcon size={18} />
              <span className={styles.lineBtnText}>Chat with Stylist</span>
            </a>
          </div>
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
            <button className={styles.closeMenuBtn} onClick={toggleMenu}>
              <X size={32} strokeWidth={1} />
            </button>
            <div className={styles.menuContainer}>
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
              
              <div className={styles.menuDivider}></div>

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
                      {menuData[activeMenu].map((subItem) => {
                        const isBrand = activeMenu === 'BRAND';
                        const name = isBrand ? subItem.name : subItem;
                        let link;
                        if (isBrand) {
                          link = `/brand/${subItem.slug}`;
                        } else if (activeMenu === 'PRECISION LENSES') {
                          link = `/lenses/${subItem.slug}`;
                        } else {
                          link = `#${name.toLowerCase().replace(/\s+/g, '-')}`;
                        }
                        
                        return (
                          <li key={isBrand ? subItem.id : name}>
                            <a href={link} className={styles.subMenuLink} onClick={toggleMenu}>
                              {name}
                            </a>
                          </li>
                        );
                      })}
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
