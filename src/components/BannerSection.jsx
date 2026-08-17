import React from 'react';
import styles from './BannerSection.module.css';

const BannerSection = ({ imageUrl, altText = "Promotional Banner", objectPosition = "center" }) => {
  return (
    <section className={styles.banner}>
      <img src={imageUrl} alt={altText} className={styles.image} style={{ objectPosition }} />
    </section>
  );
};

export default BannerSection;
