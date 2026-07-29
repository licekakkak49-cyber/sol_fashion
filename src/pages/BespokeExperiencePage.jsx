import React, { useState } from 'react';
import { Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import styles from './BespokeExperiencePage.module.css';

const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const BespokeExperiencePage = () => {
  const { contentArticles } = useAdmin();
  const [visibleCount, setVisibleCount] = useState(4);

  // Filter for bespoke category and published status
  const bespokeArticles = (contentArticles || []).filter(a => a.category === 'bespoke' && a.status === 'Published');
  
  // Sort: Pinned first, then by date descending
  const sortedArticles = [...bespokeArticles].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.publish_date || 0) - new Date(a.publish_date || 0);
  });

  const journeyData = sortedArticles.map(article => {
    let month = "FEATURED";
    let year = "";
    if (!article.is_pinned && article.publish_date) {
      const d = new Date(article.publish_date);
      month = monthNames[d.getMonth()] || "";
      year = d.getFullYear() || "";
    }
    
    return {
      id: article.id,
      month,
      year,
      title: article.title,
      description: article.excerpt,
      image: article.cover_image_url || 'https://images.unsplash.com/photo-1593214451196-37e0651f8ef2?q=80&w=1920&auto=format&fit=crop',
      isPinned: article.is_pinned
    };
  });

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
        {journeyData.slice(0, visibleCount).map((item, index) => {
          const isLeftImage = index % 2 === 0;
          
          return (
            <Link to={`/experience/${item.id}`} key={item.id} className={`${styles.timelineRow} ${isLeftImage ? styles.rowNormal : styles.rowReverse}`}>
              
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
                  <p className={styles.month}>
                    {item.month}{item.year ? ` ${item.year}` : ''}
                  </p>
                  <h2 className={styles.title}>{item.title}</h2>
                  <p className={styles.description}>{item.description}</p>
                </div>
              </div>
              
            </Link>
          );
        })}
      </div>

      {visibleCount < journeyData.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '64px', marginBottom: '64px' }}>
          <button 
            onClick={() => setVisibleCount(prev => prev + 4)}
            style={{
              padding: '12px 32px',
              background: 'transparent',
              border: '1px solid #111',
              color: '#111',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '100px'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111'; }}
          >
            Load more
          </button>
        </div>
      )}

    </div>
    </>
  );
};

export default BespokeExperiencePage;
