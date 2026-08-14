import React, { useState, useEffect } from 'react';
import { Search, User, Menu, X, MessageSquare, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import styles from './Nav.module.css';

const LineIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.967C23.156 14.375 24 12.459 24 10.314" />
  </svg>
);

const HeartIcon = ({ size = 20, color = "currentColor", strokeWidth = 1.2, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="miter" className={className}>
    <path d="M12 21.5l-8.5-8.5a5.5 5.5 0 0 1 0-7.78 5.5 5.5 0 0 1 7.78 0L12 6.5l.72-.72a5.5 5.5 0 0 1 7.78 0 5.5 5.5 0 0 1 0 7.78l-8.5 8.5z" />
  </svg>
);

const STATIC_MENU_DATA = {
  'ABOUT': ['OUR STORY', 'PHILOSOPHY', 'SUSTAINABILITY', 'MOREYES THROUGH THEIR EYES'],
  'JOIN US': ['OUR PEOPLE', 'CAREERS'],
  'NEWSROOM': ['PRESS RELEASES', 'EVENTS', 'MEDIA KIT']
};

const Nav = ({ isHomePage = false, onOpenLogin }) => {
  const location = useLocation();
  const isProductDetailPage = location.pathname.startsWith('/product/');
  const isMobileProductDetailPage = isProductDetailPage && window.innerWidth <= 768; // Initialize based on current width, but we use isMobile state later
  
  const [scrolled, setScrolled] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { openWishlist } = useWishlist();
  const { openCart, cartItems } = useCart();
  const { brands, contentArticles } = useAdmin();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const [scrollDirection, setScrollDirection] = useState('up');
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine direction (only hide after scrolling past 80px)
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setScrollDirection('down');
        document.body.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
        document.body.classList.remove('nav-hidden');
      }
      lastScrollY.current = currentScrollY;

      if (currentScrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      setShowLogo(currentScrollY > 100);

      // Check if past hero section (100vh or 85vh on mobile - nav height)
      const isMobileNow = window.innerWidth <= 768;
      const heroHeight = isMobileNow ? window.innerHeight * 0.85 : window.innerHeight;
      if (currentScrollY > heroHeight - 80) {
        setIsPastHero(true);
      } else {
        setIsPastHero(false);
      }
    };
    
    // Initial check just in case
    if (window.scrollY === 0) {
      document.body.classList.remove('nav-hidden');
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('nav-hidden');
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
        setActiveMenu(null);
    }
  };

  const dropdownHeight = (activeDropdown === 'brands' || activeDropdown === 'lenses') ? 500 : 0;
  const baseNavHeight = isMobile ? 66 : 80;
  const navHeight = baseNavHeight + dropdownHeight;

  // Mobile specific: solid white background when scrolling up
  const forceSolidWhite = isMobile && scrollDirection === 'up' && scrolled && !isProductDetailPage;

  const isMobilePDP = isMobile && isProductDetailPage;
  const isTransparent = forceSolidWhite ? false : (isHomePage || isMobilePDP);
  const isHidden = !isHomePage && !isMobilePDP && (scrollDirection === 'down' && scrolled);
  const useWhiteText = forceSolidWhite ? false : (isHomePage && !isPastHero && !isMenuOpen && !activeDropdown);
  const showScrolledBackground = (!isHomePage && !isMobilePDP) && (scrolled || activeDropdown);

  return (
    <>
      <nav 
        className={`${styles.nav} ${showScrolledBackground ? styles.scrolled : ''} ${isHomePage ? styles.homeNav : ''} ${showLogo || activeDropdown ? styles.showLogo : ''} ${isHidden ? styles.hidden : ''} ${isTransparent ? styles.transparent : ''} ${useWhiteText ? styles.whiteText : ''}`}
        style={{ height: `${navHeight}px` }}
      >


        <div className={styles.left}>
          <Link to="/" className={styles.logoContainer}>
            <span className={styles.textLogo}>SOL</span>
            <span className={styles.tagline}>Let your Sol shine</span>
          </Link>
          <ul className={styles.navLinks}>
            <li><Link to="/products">New In</Link></li>
            <li><Link to="/products">Bags</Link></li>
            <li><Link to="/products">Ready-to-Wear</Link></li>
            <li><Link to="/products">Accessories</Link></li>
            <li><Link to="/explore">Explore</Link></li>
          </ul>
        </div>

        <div className={styles.right}>
          <div className={styles.iconGroup}>
            <button className={styles.iconBtn} aria-label="Search">
              <Search size={18} strokeWidth={1.2} />
            </button>
            <button className={styles.iconBtn} aria-label="Account" onClick={onOpenLogin}>
              <User size={18} strokeWidth={1.2} />
            </button>
            <button className={styles.iconBtn} aria-label="Wishlist" onClick={openWishlist}>
              <HeartIcon size={18} color="currentColor" strokeWidth={1.2} />
            </button>
            <button className={styles.cartBtn} aria-label="Cart" onClick={openCart}>
              <span className={styles.cartText}>Cart</span>
              {cartItems.length > 0 ? (
                <span className={styles.cartCount}>{cartItems.length}</span>
              ) : (
                <span className={styles.cartDot}></span>
              )}
            </button>
            
            {/* Mobile Hamburger Button */}
            <button 
              className={styles.mobileMenuBtn} 
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <Menu size={24} strokeWidth={1} />
            </button>
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
            {isMobile ? (
              <div className={styles.mobileMenuContainer}>
                {/* Mobile Header: Logo and Close */}
                <div className={styles.mobileMenuHeader}>
                  <Link to="/" className={styles.logoContainer} onClick={toggleMenu}>
                    <span className={styles.textLogo}>SOL</span>
                    <span className={styles.tagline}>Let your Sol shine</span>
                  </Link>
                  <button className={styles.mobileCloseBtn} onClick={toggleMenu}>
                    <X size={28} strokeWidth={1} />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className={styles.mobileSearchContainer}>
                  <Search size={18} strokeWidth={1} className={styles.mobileSearchIcon} />
                  <input type="text" placeholder="Search here..." className={styles.mobileSearchInput} />
                </div>

                {/* Mobile Main Links */}
                <ul className={styles.mobileMenuLinks}>
                  <li><Link to="/products" onClick={toggleMenu}>New In</Link></li>
                  <li><Link to="/products" onClick={toggleMenu}>Bags</Link></li>
                  <li><Link to="/products" onClick={toggleMenu}>Ready-to-Wear</Link></li>
                  <li><Link to="/products" onClick={toggleMenu}>Accessories</Link></li>
                  <li><Link to="/explore" onClick={toggleMenu}>Explore</Link></li>
                </ul>

                {/* Mobile Footer Links */}
                <div className={styles.mobileMenuFooter}>
                  <button className={styles.mobileFooterBtn} onClick={() => { toggleMenu(); openCart(); }}>
                    {cartItems.length > 0 ? (
                      <span className={styles.mobileCartCount}>{cartItems.length}</span>
                    ) : (
                      <span className={styles.cartDotSmall}></span>
                    )}
                    Cart
                  </button>
                  <button className={styles.mobileFooterBtn} onClick={() => { toggleMenu(); onOpenLogin(); }}>
                    <User size={16} strokeWidth={1} className={styles.mobileFooterIcon} />
                    Account
                  </button>
                  <button className={styles.mobileFooterBtn} onClick={() => { toggleMenu(); openWishlist(); }}>
                    <HeartIcon size={16} color="currentColor" strokeWidth={1} className={styles.mobileFooterIcon} />
                    Wishlist
                  </button>
                  <div className={styles.mobileFooterBottomLinks}>
                    <button className={styles.mobileFooterBtnLine}>
                      <span className={styles.underlineText}>Thailand (THB) / English</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
