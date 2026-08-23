import React from 'react';
import styles from '../BannerSection.module.css';

const BannerBlock = ({ data }) => {
  const imageUrl = data?.imageUrl || "https://alemais.com/cdn/shop/files/260702_ALE_15_013_a.jpg?v=1786427393&width=2048";
  const objectPosition = data?.objectPosition || 'center';

  return (
    <section className={styles.banner}>
      <img src={imageUrl} alt="Banner" className={styles.image} style={{ objectPosition }} />
    </section>
  );
};

export default BannerBlock;
