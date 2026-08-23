import React from 'react';
import styles from './BannerSection.module.css';

const BannerSection = ({ data, imageUrl, altText = "Promotional Banner", objectPosition = "center" }) => {
  const finalImage = data?.imageUrl || imageUrl;
  const finalAlt = data?.altText || altText;
  const finalPosition = data?.objectPosition || objectPosition;

  return (
    <section className={styles.banner}>
      <img src={finalImage} alt={finalAlt} className={styles.image} style={{ objectPosition: finalPosition }} />
    </section>
  );
};

export default BannerSection;
