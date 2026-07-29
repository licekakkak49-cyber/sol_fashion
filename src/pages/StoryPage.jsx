import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import styles from './StoryPage.module.css';

const STORY_DATA = [
  {
    id: 1,
    title: "Inside the world of Resort 2027",
    image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Backstage | Resort 2027",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Runway | Resort 2027",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Artist Collaboration | MLAK",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "The making of our new collection",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1500&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Editorial Campaign",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1500&auto=format&fit=crop"
  }
];

const CATEGORIES = ['All', 'Artist Collab', 'Campaign', 'Community', 'Lookbook', 'Runway'];

const StoryPage = () => {
  const { contentArticles } = useAdmin();
  const [stories, setStories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  useEffect(() => {
    if (contentArticles && contentArticles.length > 0) {
      const exploreArticles = contentArticles.filter(a => a.category === 'explore' && a.status === 'Published');
      // Sort: Pinned first, then by date (newest first)
      exploreArticles.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date) - new Date(a.date);
      });
      setStories(exploreArticles.length > 0 ? exploreArticles : null);
    }
    // Check scroll after stories update
    setTimeout(checkScroll, 100);
  }, [contentArticles]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      // Scroll by approximately one visible card width
      const scrollAmount = window.innerWidth / 4.5; 
      
      const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      
      setTimeout(checkScroll, 350);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.6,
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const displayData = stories || STORY_DATA;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.filterSection}>
          <button 
            className={styles.filterToggleBtn}
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            Filters
          </button>
          
          <AnimatePresence>
            {isFiltersExpanded && (
              <>
                <motion.div 
                  className={styles.filterLine}
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />

                <motion.div 
                  className={styles.categories}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className={`${styles.categoryBtn} ${activeCategory === cat ? styles.activeCategory : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className={styles.carouselContainer}>
        {canScrollLeft && (
          <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={() => scroll('left')}>
            <ChevronLeft size={28} strokeWidth={1} />
          </button>
        )}
        
        <div className={styles.horizontalScroll} ref={scrollRef} onScroll={checkScroll}>
          {displayData.map((item) => {
            const isDynamic = !!item.category;
            const imageSrc = isDynamic 
              ? (item.thumbnailImage || item.coverImage)
              : item.image;
            
            if (isDynamic) {
              return (
                <Link to={`/story/${item.id}`} key={item.id} className={styles.storyCard}>
                  <img src={imageSrc} alt={item.title} className={styles.image} />
                  <p className={styles.title}>{item.title}</p>
                </Link>
              );
            }

            return (
              <div key={item.id} className={styles.storyCard}>
                <img src={imageSrc} alt={item.title} className={styles.image} />
                <p className={styles.title}>{item.title}</p>
              </div>
            );
          })}
        </div>

        {canScrollRight && (
          <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={() => scroll('right')}>
            <ChevronRight size={28} strokeWidth={1} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryPage;
