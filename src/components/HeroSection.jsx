import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
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
    { src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/Screenshot%202569-07-12%20at%2014.29.15.png", position: "0% 0%", transform: "scale(1.35) translate(0%, 8%)" },
    { src: "https://ttfdcqpzaxnxduvlhtgi.supabase.co/storage/v1/object/public/WAYD-gallery/AMQ_MOSAICO_MENU_480x800px.jpg", position: "center 15%" },
    { src: "https://images.unsplash.com/photo-1696240033664-ed34314724af?w=1920&auto=format&fit=crop&q=80", position: "center" }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // Auto cycle images every 5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % rightImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [rightImages.length, isPlaying]);

  // Track scroll for fading out center text
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Calculate opacity based on scroll (starts fading out at 0, fully transparent by 120px)
  const overlayOpacity = Math.max(1 - scrollY / 120, 0);
  const overlayTransform = `translate(-50%, calc(-50% - ${scrollY * 1.2}px))`;

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
              src={rightImages[currentIdx].src} 
              alt="Eyewear Model" 
              className={styles.rightImage} 
              style={{ 
                objectPosition: rightImages[currentIdx].position,
                transform: rightImages[currentIdx].transform || (rightImages[currentIdx].scale ? `scale(${rightImages[currentIdx].scale})` : 'none')
              }}
            />
            {/* The Black Reveal Curtain */}
            <motion.div
              initial={{ scaleY: 1, transformOrigin: 'bottom' }}
              animate={{ 
                scaleY: 0, 
                transformOrigin: 'bottom',
                transition: { duration: 0.35, ease: [0.645, 0.045, 0.355, 1.000], delay: 0.12 }
              }}
              exit={{ 
                scaleY: 1, 
                transformOrigin: 'bottom',
                transition: { duration: 0.35, ease: [0.645, 0.045, 0.355, 1.000] }
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

        {/* Play/Pause Minimal Button */}
        <button 
          className={styles.minimalPlayBtn} 
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause auto play" : "Start auto play"}
        >
          {isPlaying ? <Pause size={24} strokeWidth={1} /> : <Play size={24} strokeWidth={1} />}
        </button>
      </div>

      {/* Center Text Overlay */}
      <div 
        className={styles.overlayText} 
        style={{ 
          opacity: overlayOpacity, 
          transform: overlayTransform,
          pointerEvents: overlayOpacity > 0 ? 'auto' : 'none'
        }}
      >
        <h2>MOREYES</h2>
      </div>

    </section>
  );
};

export default HeroSection;
