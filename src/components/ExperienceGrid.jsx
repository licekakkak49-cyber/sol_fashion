import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import styles from './ExperienceGrid.module.css';

const ExperienceGrid = () => {
  const { contentArticles } = useAdmin();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter bespoke articles that are published
  const displayServices = React.useMemo(() => {
    if (!contentArticles) return [];
    const bespokeArticles = contentArticles.filter(a => a.category === 'bespoke' && a.status === 'Published');
    
    // Sort: Pinned first, then by date
    bespokeArticles.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });
    
    return bespokeArticles;
  }, [contentArticles]);


  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      // use Math.ceil to avoid rounding issues on high DPI screens
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  };

  useEffect(() => {
    // Initial check in case window is resized or initially loaded
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      // Calculate width of one card + gap
      const firstCard = scrollRef.current.querySelector(`.${styles.card}`);
      const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>OUR BESPOKE EXPERIENCE</h2>
          <Link to="/experience" className={styles.moreLink}>MORE</Link>
        </div>
      </div>

      <div className={styles.carouselContainer}>
        {canScrollLeft && (
          <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={() => scroll('left')}>
            <ChevronLeft size={28} strokeWidth={1} />
          </button>
        )}
        
        <div className={styles.grid} ref={scrollRef} onScroll={checkScroll}>
          {displayServices.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={item.thumbnailImage || item.coverImage} alt={item.title} className={styles.image} />
                <div className={styles.textOverlay}>
                  <p className={styles.name}>{item.title}</p>
                  <p className={styles.price}>{item.excerpt}</p>
                  <Link to={`/experience/${item.id}`} className={styles.discoverLink}>DISCOVER MORE</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={() => scroll('right')}>
            <ChevronRight size={28} strokeWidth={1} />
          </button>
        )}
      </div>
    </section>
  );
};

export default ExperienceGrid;
