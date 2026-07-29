import React from 'react';
import styles from './StoreSection.module.css';

const StoreSection = () => {
  return (
    <div className={styles.gridContainer}>
      {/* Left Column: Premium Boutique Atelier Image */}
      <div className={styles.imageColumn}>
        <img 
          src="https://images.unsplash.com/photo-1664437235473-65aaf8912d20?w=1600&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8THV4dXJ5JTIwb3B0aWNpYW4lMjBjb25zdWx0YXRpb258ZW58MHx8MHx8fDA%3D" 
          alt="Luxury Optician Consultation" 
          className={styles.imageCover} 
        />
      </div>

      {/* Right Column: Curation & Expertise Brand Text */}
      <div className={styles.textColumn}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.heading}>CRAFTED FOR YOUR JOURNEY</h2>
          <p className={styles.subtext}>
            Your eyewear should be a seamless extension of your lifestyle. 
            We combine advanced medical precision with personalized curation to engineer the ultimate optical instrument tailored specifically for you. 
            Step out and explore the world—we'll ensure you experience it with absolute clarity.
          </p>
        </div>
        <div className={styles.footerLinkWrapper}>
          <a href="/atelier" className={styles.link}>
            FIND YOUR PERFECT MATCH
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoreSection;
