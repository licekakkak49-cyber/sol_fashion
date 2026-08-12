import React from 'react';
import styles from './BannerSection.module.css';

const BannerSection = ({ imageUrl, altText = "Promotional Banner" }) => {
  return (
    <section className={styles.banner}>
      <img src={imageUrl} alt={altText} className={styles.image} />
    </section>
  );
};

export default BannerSection;
