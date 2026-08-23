import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../HeroSection.module.css'; 

const HeroBlock = ({ data }) => {
  const imageUrl = data?.imageUrl || data?.bgImage;
  const linkUrl = data?.linkUrl;
  const objectPosition = data?.objectPosition || 'center';
  
  if (!imageUrl) return null;

  const content = (
    <section className={styles.hero} style={{ width: '100%', height: '100%' }}>
      <img src={imageUrl} alt="Hero" className={styles.heroBg} style={{ objectPosition, width: '100%', height: '100%', objectFit: 'cover' }} />
    </section>
  );

  return linkUrl ? (
    <Link to={linkUrl} style={{ display: 'block', width: '100%', height: '100%' }}>
      {content}
    </Link>
  ) : (
    content
  );
};

export default HeroBlock;
