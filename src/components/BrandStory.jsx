import React from 'react';
import styles from './BrandStory.module.css';

const BrandStory = () => {
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.container}>
        <h2 className={styles.heading}>MOREYES</h2>
        <p className={styles.paragraph}>
          Moreyes is your premier destination for bespoke vision, seamlessly blending medical precision with high-end lifestyle. We elevate your everyday through personalized eye care and a curated portfolio of world-renowned luxury eyewear. Discover where advanced optical technology meets uncompromising style.
        </p>
        
        <a href="/story" className={styles.link}>
          EXPLORE MORE
        </a>
      </div>
    </section>
  );
};

export default BrandStory;
