import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './MinimalFooter.module.css';

const MinimalFooter = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerTop}>
        <div className={styles.footerCol}>
          <h4>HELP</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQ's</a></li>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Stores</a></li>
          </ul>
        </div>
        <div className={styles.footerCol}>
          <h4>ABOUT SOL</h4>
          <ul>
            <li><a href="/story">Our Story</a></li>
            <li><a href="#">Terms and Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className={styles.footerCol}>
          <h4>EMAIL SIGN UP</h4>
          <p className={styles.newsletterText}>
            <a href="#" className={styles.linkUnderline}>Sign up</a> to our newsletter for the latest updates from SOL, including exclusive online pre-launches and new collections.
          </p>
          <div className={styles.followUsBtn}>
            Follow Us <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.linkUnderline}>Instagram</a>
          </div>
        </div>
      </div>

      {/* Mobile Prefooter Accordion */}
      <div className={styles.mobilePrefooter}>
        <div className={styles.accordionItem}>
          <div className={styles.accordionHeaderStatic}>
            <span>Email Sign Up</span>
          </div>
          <div className={styles.newsletterMobile}>
            <p className={styles.newsletterText}>
              Sign up to our newsletter for the latest updates from SOL, including exclusive online pre-launches and new collections.
            </p>
            <button className={styles.registerBtn} style={{ width: '100%' }}>Register</button>
          </div>
        </div>

        <div className={styles.accordionItem}>
          <button className={styles.accordionHeader} onClick={() => toggleAccordion('legal')}>
            <span>Legal</span>
            {openAccordion === 'legal' ? <ChevronUp size={16} strokeWidth={1} /> : <ChevronDown size={16} strokeWidth={1} />}
          </button>
          <div className={`${styles.accordionContent} ${openAccordion === 'legal' ? styles.open : ''}`}>
            <ul>
              <li><a href="#">Terms and Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.accordionItem}>
          <button className={styles.accordionHeader} onClick={() => toggleAccordion('faq')}>
            <span>FAQ</span>
            {openAccordion === 'faq' ? <ChevronUp size={16} strokeWidth={1} /> : <ChevronDown size={16} strokeWidth={1} />}
          </button>
          <div className={`${styles.accordionContent} ${openAccordion === 'faq' ? styles.open : ''}`}>
            <ul>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.accordionItem}>
          <button className={styles.accordionHeader} onClick={() => toggleAccordion('about')}>
            <span>About SOL</span>
            {openAccordion === 'about' ? <ChevronUp size={16} strokeWidth={1} /> : <ChevronDown size={16} strokeWidth={1} />}
          </button>
          <div className={`${styles.accordionContent} ${openAccordion === 'about' ? styles.open : ''}`}>
            <ul>
              <li><a href="/story">Our Story</a></li>
              <li><a href="#">Stores</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.accordionItem}>
          <div className={styles.accordionHeaderStatic}>
            <span>Follow</span>
          </div>
          <div className={styles.socialLinksRow}>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Tiktok</a>
            <a href="#">X</a>
            <a href="#">Pinterest</a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.left}>
          <span>© SOL 2026</span>
        </div>
        
        <div className={styles.center}>
          <span className={styles.logo}>SOL</span>
        </div>

        <div className={styles.right}>
          <div className={styles.rawSettings}>
            <button className={styles.rawSettingBtn}>
              <span className={styles.rawUnderline}>Thailand (THB)</span>
            </button>
            <span className={styles.rawDivider}>/</span>
            <button className={styles.rawSettingBtn}>
              <span className={styles.rawUnderline}>English</span>
              <ChevronDown size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <button 
        className={`${styles.scrollTopBtn} ${showScrollTop ? styles.visible : ''}`} 
        onClick={scrollToTop} 
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} strokeWidth={1.5} />
      </button>
    </footer>
  );
};

export default MinimalFooter;
