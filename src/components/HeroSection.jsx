import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  // Placeholder images for the left side slider
  const sliderImages = [
    'https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/heroglass1.png',
    'https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/heroglass2.jpg',
    'https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/heroglass3.jpg',
    'https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/heroglass4.png',
    'https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/heroglass5.png',
    'https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/heroglass6.png',
    'https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/heroglass7.png',
    'https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/heroglass8.png'
  ];

  const rightImages = [
    "https://plus.unsplash.com/premium_photo-1672322565907-932e7554b1cc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1696240033664-ed34314724af?w=1920&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1728871228369-0cbc3a23bec4?w=1920&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512130017599-6e7db038ea4f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto cycle images every 5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % rightImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [rightImages.length, isPlaying]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % rightImages.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + rightImages.length) % rightImages.length);
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  return (
    <section className={styles.hero}>
      {/* Left Side: Image Slider */}
      <div className={styles.leftHalf}>
        <div className={styles.sliderTrack}>
          {/* Simple CSS animation for scrolling */}
          {sliderImages.map((src, index) => (
            <img key={`img1-${index}`} src={src} alt="Eyewear" className={styles.sliderImage} />
          ))}
          {/* Duplicate for infinite loop effect */}
          {sliderImages.map((src, index) => (
            <img key={`img2-${index}`} src={src} alt="Eyewear" className={styles.sliderImage} />
          ))}
        </div>
      </div>

      {/* Right Side: Animated Image Slider */}
      <div className={styles.rightHalf}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <img 
              src={rightImages[currentIdx]} 
              alt="Eyewear Model" 
              className={styles.rightImage} 
            />
            {/* The Black Reveal Curtain */}
            <motion.div
              initial={{ scaleY: 1, transformOrigin: 'bottom' }}
              animate={{ 
                scaleY: 0, 
                transformOrigin: 'bottom',
                transition: { duration: 0.4, ease: [0.645, 0.045, 0.355, 1.000], delay: 0.15 }
              }}
              exit={{ 
                scaleY: 1, 
                transformOrigin: 'bottom',
                transition: { duration: 0.4, ease: [0.645, 0.045, 0.355, 1.000] }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#111111',
                zIndex: 2,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Play/Pause Glassmorphic Button */}
        <button 
          className={styles.glassPlayBtn} 
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause auto play" : "Start auto play"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Center Text Overlay (Optional, based on reference image) */}
      <div className={styles.overlayText}>
        <h2>MOREYES</h2>
      </div>

      {/* Bottom Navigation */}
      <div className={styles.bottomNav}>
        <button className={styles.navArrow} onClick={handlePrev}>
          <svg viewBox="0 0 24 24" width="110" height="110" stroke="currentColor" strokeWidth="0.2" fill="none">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div className={styles.navTextContainer}>
          <span className={styles.navText}>NEW ARRIVALS</span>
          <div className={styles.navLine}></div>
        </div>
        <button className={styles.navArrow} onClick={handleNext}>
          <svg viewBox="0 0 24 24" width="110" height="110" stroke="currentColor" strokeWidth="0.2" fill="none">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
