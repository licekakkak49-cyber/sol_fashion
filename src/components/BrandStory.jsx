import React from 'react';
import styles from './BrandStory.module.css';

const BrandStory = () => {
  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>MOREYES</h1>
      
      <p className={styles.paragraph}>
        Moreyes is a premier destination for bespoke vision, seamlessly blending medical precision with high-end lifestyle.
      </p>
      
      <p className={styles.paragraph}>
        We are dedicated to elevating your quality of life through personalized, "cut and done" eye care tailored by our expert optometrists.
      </p>
      
      <p className={styles.paragraph}>
        Offering an extensive portfolio of world-renowned luxury and lifestyle brands—including Prada, Gucci, Oakley, Silhouette, and Moscot—we curate eyewear that perfectly complements your unique daily activities, whether you are an executive, an active explorer, or a creative professional.
      </p>
      
      <p className={styles.paragraph}>
        Moreyes is where advanced optical technology meets uncompromising style.
      </p>

      <a href="/story" className={styles.link}>
        MORE ABOUT MOREYES
      </a>
      <div className={styles.line}></div>
    </section>
  );
};

export default BrandStory;
