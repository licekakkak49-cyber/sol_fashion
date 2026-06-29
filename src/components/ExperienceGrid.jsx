import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ExperienceGrid.module.css';

const services = [
  {
    id: 'pin1',
    title: "BLUE & BEYOND",
    description: "Smart dual-innovation lenses: crystal-clear blue light filtering indoors, and instant UV protection outdoors.",
    image: "https://images.unsplash.com/photo-1608243136637-48b0924bfc9f?w=1920&auto=format&fit=crop&q=80",
    link: "/experience",
    overlayText: {
      title: "BLUE & BEYOND"
    }
  },
  {
    id: 'pin2',
    title: "SUSTAINABILITY",
    description: "Learn more about our commitment to Sustainability through three pillars: Care, Collaborate and Create.",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1920&auto=format&fit=crop&q=80",
    link: "/experience"
  },
  {
    id: 6,
    title: "PREMIUM CRAFTSMANSHIP",
    description: "The final masterpiece: your custom lenses precisely fitted into luxurious frames, ready to redefine how you see the world.",
    image: "https://images.unsplash.com/photo-1716809178831-82b231c279fa?w=1920&auto=format&fit=crop&q=80",
    link: "/experience"
  },
  {
    id: 5,
    title: "BESPOKE CONSULTATION",
    description: "Sit down with our specialists for a comprehensive lifestyle assessment to craft a visual solution uniquely tailored to your daily needs.",
    image: "https://plus.unsplash.com/premium_photo-1661587272603-ec1d6420767b?w=1920&auto=format&fit=crop&q=80",
    link: "/experience"
  },
  {
    id: 4,
    title: "PEDIATRIC CARE",
    description: "We provide specialized, gentle care for our youngest clients, ensuring their visual development is nurtured with the best tools available.",
    image: "https://images.unsplash.com/photo-1539036776273-021ec1d78bec?w=1920&auto=format&fit=crop&q=80",
    link: "/experience"
  },
  {
    id: 3,
    title: "EXECUTIVE ELEGANCE",
    description: "For the discerning individual, we offer eyewear that balances professional sophistication with uncompromising optical performance.",
    image: "https://images.unsplash.com/photo-1506667527953-22eca67dd919?w=1920&auto=format&fit=crop&q=80",
    link: "/experience"
  },
  {
    id: 2,
    title: "CURATED SELECTION",
    description: "Discover frames that perfectly complement your facial features and personal style, guided by our expert optical stylists.",
    image: "https://images.unsplash.com/photo-1545922161-ddbd53e0f89f?w=1920&auto=format&fit=crop&q=80",
    link: "/experience"
  },
  {
    id: 1,
    title: "PRECISION DIAGNOSTICS",
    description: "Our journey begins with state-of-the-art diagnostic technology, ensuring every aspect of your vision is measured with absolute accuracy.",
    image: "https://images.unsplash.com/photo-1616163477138-508df4131a38?w=1920&auto=format&fit=crop&q=80",
    link: "/experience"
  }
];

const ExperienceGrid = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowLeftArrow(scrollContainerRef.current.scrollLeft > 20);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Trigger once to set initial state
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Our Bespoke Experience</h2>
        <Link to="/experience" className={styles.viewAll}>
          VIEW ALL
        </Link>
      </div>

      <div className={styles.scrollWrapper}>
        {showLeftArrow && (
          <button 
            className={`${styles.scrollButton} ${styles.leftButton}`} 
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
        )}

        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {services.map((service) => (
            <div key={service.id} className={styles.card}>
              <a href={service.link} className={styles.imageLink}>
                <div className={styles.imageWrapper}>
                  <img src={service.image} alt={service.title} className={styles.image} />
                  {service.overlayText && (
                    <div className={styles.imageOverlay}>
                      <h4 className={styles.overlayTitle}>{service.overlayText.title}</h4>
                    </div>
                  )}
                </div>
              </a>
              <div className={styles.content}>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.description}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Optional scroll button to match Kering Eyewear / Oliver Peoples slider style */}
        <button 
          className={styles.scrollButton} 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} strokeWidth={1} />
        </button>
      </div>
    </section>
  );
};

export default ExperienceGrid;
