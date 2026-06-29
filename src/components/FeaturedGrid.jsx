import React, { useState, useEffect } from 'react';
import styles from './FeaturedGrid.module.css';

const brands = [
  {
    name: "PRADA",
    logo: "/images/logo_prada.svg"
  },
  {
    name: "VERSACE",
    logo: "/images/logo_versace.svg"
  },
  {
    name: "MIU MIU",
    logo: "/images/logo_miumiu.svg"
  },
  {
    name: "RAY-BAN",
    logo: "/images/logo_rayban.svg"
  },
  {
    name: "MOSCOT",
    logo: "/images/logo_moscot.svg"
  },
  {
    name: "BOLON",
    logo: "/images/logo_bolon.svg"
  },
  {
    name: "SILHOUETTE",
    logo: "/images/logo_silhouette.svg"
  }
];

const FeaturedGrid = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // Step 1: Start the quick blink
      setIsBlinking(true);
      
      // Step 2: Swap the image exactly at the dark frame (50ms)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
      }, 50);

      // Step 3: Finish the blink animation (100ms)
      setTimeout(() => {
        setIsBlinking(false);
      }, 100);
    }, 1500); // Rhythmic 1.5-second interval (slower rhythm)

    return () => clearInterval(timer);
  }, []);

  const currentBrand = brands[currentIndex];

  return (
    <div className={styles.gridContainer}>
      {/* Left Column: Rhythmic Flashing Brand Logo */}
      <div className={styles.textColumn}>
        <div className={`${styles.logoContainer} ${isBlinking ? styles.blink : ''}`}>
          {brands.map((brand, index) => (
            <img 
              key={brand.name}
              src={brand.logo} 
              alt={`${brand.name} Logo`} 
              className={`${styles.brandLogoImage} ${index === currentIndex ? styles.activeLogo : styles.inactiveLogo}`} 
            />
          ))}
        </div>
      </div>

      {/* Right Column: Prada Campaign Image */}
      <div className={styles.imageColumn}>
        <img 
          src="https://images.unsplash.com/photo-1728871228373-535451aae390?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Prada Campaign Eyewear" 
          className={styles.imageCover} 
        />
      </div>
    </div>
  );
};

export default FeaturedGrid;
