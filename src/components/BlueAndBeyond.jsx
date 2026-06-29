import React from 'react';
import styles from './BlueAndBeyond.module.css';

const BlueAndBeyond = () => {
  return (
    <div className={styles.gridContainer}>
      {/* Left Column: Product Image (Macro Lens Focus) */}
      <div className={styles.imageColumn}>
        <img 
          src="/images/blue_beyond.png" 
          alt="Macro shot of luxury photochromic and blue light glasses" 
          className={styles.imageCover} 
        />
      </div>

      {/* Right Column: Technology & Lifestyle Text */}
      <div className={styles.textColumn}>
        <div className={styles.contentWrapper}>
          <p className={styles.eyebrow}>BESPOKE TECHNOLOGY</p>
          <h2 className={styles.heading}>SMART VISION, ICONIC STYLE</h2>
          <p className={styles.subtext}>
            Introducing a groundbreaking combination of luxury and technology. 
            Our curated dual-innovation lenses protect your eyes from digital blue light indoors 
            and automatically adapt to sunlight outdoors—crafted seamlessly into the world's most prestigious frames.
          </p>
        </div>
        <div className={styles.footerLinkWrapper}>
          <a href="/blue-and-beyond" className={styles.link}>
            EXPLORE BLUE & BEYOND
          </a>
          <div className={styles.line}></div>
        </div>
      </div>
    </div>
  );
};

export default BlueAndBeyond;
