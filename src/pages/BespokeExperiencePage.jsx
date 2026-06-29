import React from 'react';
import { Pin } from 'lucide-react';
import styles from './BespokeExperiencePage.module.css';

const journeyData = [
  {
    id: 'pin1',
    month: "FEATURED",
    year: "",
    title: "BLUE & BEYOND",
    description: "Smart dual-innovation lenses: crystal-clear blue light filtering indoors, and instant UV protection outdoors.",
    image: "https://images.unsplash.com/photo-1608243136637-48b0924bfc9f?w=1920&auto=format&fit=crop&q=80",
    isPinned: true
  },
  {
    id: 'pin2',
    month: "FEATURED",
    year: "",
    title: "SUSTAINABILITY",
    description: "Learn more about our commitment to Sustainability through three pillars: Care, Collaborate and Create.",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1920&auto=format&fit=crop&q=80",
    isPinned: true
  },
  {
    id: 6,
    month: "DECEMBER",
    year: "2024",
    title: "PREMIUM CRAFTSMANSHIP",
    description: "The final masterpiece: your custom lenses precisely fitted into luxurious frames, ready to redefine how you see the world.",
    image: "https://images.unsplash.com/photo-1716809178831-82b231c279fa?w=1920&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    month: "NOVEMBER",
    year: "2024",
    title: "BESPOKE CONSULTATION",
    description: "Sit down with our specialists for a comprehensive lifestyle assessment to craft a visual solution uniquely tailored to your daily needs.",
    image: "https://plus.unsplash.com/premium_photo-1661587272603-ec1d6420767b?w=1920&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    month: "OCTOBER",
    year: "2024",
    title: "PEDIATRIC CARE",
    description: "We provide specialized, gentle care for our youngest clients, ensuring their visual development is nurtured with the best tools available.",
    image: "https://images.unsplash.com/photo-1539036776273-021ec1d78bec?w=1920&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    month: "SEPTEMBER",
    year: "2024",
    title: "EXECUTIVE ELEGANCE",
    description: "For the discerning individual, we offer eyewear that balances professional sophistication with uncompromising optical performance.",
    image: "https://images.unsplash.com/photo-1506667527953-22eca67dd919?w=1920&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    month: "AUGUST",
    year: "2024",
    title: "CURATED SELECTION",
    description: "Discover frames that perfectly complement your facial features and personal style, guided by our expert optical stylists.",
    image: "https://images.unsplash.com/photo-1545922161-ddbd53e0f89f?w=1920&auto=format&fit=crop&q=80"
  },
  {
    id: 1,
    month: "JULY",
    year: "2024",
    title: "PRECISION DIAGNOSTICS",
    description: "Our journey begins with state-of-the-art diagnostic technology, ensuring every aspect of your vision is measured with absolute accuracy.",
    image: "https://images.unsplash.com/photo-1616163477138-508df4131a38?w=1920&auto=format&fit=crop&q=80"
  }
];

const BespokeExperiencePage = () => {
  return (
    <>
      {/* Full-Screen Hero Image Section */}
      <div className={styles.heroContainer}>
        <img 
          src="https://images.unsplash.com/photo-1593214451196-37e0651f8ef2?q=80&w=1920&auto=format&fit=crop" 
          alt="Our Bespoke Experience" 
          className={styles.heroImage} 
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitleLarge}>OUR BESPOKE EXPERIENCE</h1>
          <div className={styles.heroSubtitleContainer}>
            <p className={styles.heroTitleSmall}>OUR BESPOKE EXPERIENCE</p>
            <div className={styles.heroLine}></div>
          </div>
        </div>
      </div>

      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.mainTitle}>STORIES OF EXTRAORDINARY VISION</h1>
          <p className={styles.subtitle}>
            Discover the intersection of medical precision and luxury lifestyle. Our journey is defined by the extraordinary vision we craft for you.
          </p>
        </div>

      <div className={styles.timelineContainer}>
        {journeyData.map((item, index) => {
          const isLeftImage = index % 2 === 0;
          
          return (
            <div key={item.id} className={`${styles.timelineRow} ${isLeftImage ? styles.rowNormal : styles.rowReverse}`}>
              
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <img src={item.image} alt={item.title} className={styles.image} />
                  {item.isPinned && (
                    <div className={styles.pinBadge}>
                      <Pin size={24} strokeWidth={1.5} color="#fff" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.textColumn}>
                <div className={`${styles.textContent} ${isLeftImage ? styles.textRightAligned : styles.textLeftAligned}`}>
                  <p className={styles.month}>{item.month}</p>
                  <p className={styles.year}>{item.year}</p>
                  <h2 className={styles.title}>{item.title}</h2>
                  <p className={styles.description}>{item.description}</p>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default BespokeExperiencePage;
