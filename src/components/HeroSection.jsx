import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  // We'll use a placeholder fashion image for now
  const bgImage = "https://eu.louisvuitton.com/images/is/poster-video/a25fad50-3ff4-41f5-b12a-620f594cdd8b/wSO0wPeD0dRi6wN39bddgxGF.jpg?wid=4096";

  return (
    <section className={styles.hero}>
      <img src={bgImage} alt="SOL Collection" className={styles.heroBg} />
      <div className={styles.heroContent}>
         {/* Future text/button content can go here */}
      </div>
    </section>
  );
};

export default HeroSection;
