import React from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './MinimalFooter.module.css';

const MinimalFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.column}>
        <a href="#">Contact Us</a>
        <a href="#">Shipping</a>
        <a href="#">Returns</a>
        <a href="#">Style/Store Locator</a>
        <a href="#">FAQ</a>
        <a href="#">Careers</a>
      </div>
      
      <div className={styles.column}>
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
        <a href="#">TikTok</a>
        <a href="#">Pinterest</a>
        <a href="#">Terms and Conditions</a>
        <a href="#">Privacy Policy</a>
      </div>

      <div className={styles.newsletterColumn}>
        <span className={styles.newsletterTitle}>Subscribe to our newsletter</span>
        <div className={styles.inputGroup}>
          <input type="email" placeholder="Email address" className={styles.emailInput} />
          <button className={styles.submitBtn} aria-label="Subscribe">
            <ArrowRight size={16} strokeWidth={1} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
