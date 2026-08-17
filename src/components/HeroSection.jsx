import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  // We'll use a placeholder fashion image for now
  const bgImage = "https://alemais.com/cdn/shop/files/260702_ALE_13_148_b_c2071b45-d815-48aa-a633-7cd37fbb13f0.jpg?v=1786427331&width=2048";

  return (
    <section className={styles.hero}>
      <img src={bgImage} alt="SOL Collection" className={styles.heroBg} style={{ objectPosition: 'top' }} />
      <div className={styles.heroContent}>
         {/* Future text/button content can go here */}
      </div>
    </section>
  );
};

export default HeroSection;
