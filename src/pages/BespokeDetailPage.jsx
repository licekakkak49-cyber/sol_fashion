import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import styles from './BespokeDetailPage.module.css';

// No mock data needed for SHOWCASE_PRODUCTS

// No legacy mock data needed

const BespokeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contentArticles, products, brands, loading: contextLoading } = useAdmin();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!contextLoading) {
      if (contentArticles) {
        const found = contentArticles.find(a => a.id === id);
        setArticle(found);
      }
      setLoading(false);
    }
  }, [id, contentArticles, contextLoading]);

  if (loading || contextLoading) return <div>Loading...</div>;

  const renderDescription = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <p key={index} style={{ margin: '5px 0' }}>{line}</p>
    ));
  };

  // Removed legacy render block

  // If not legacy and no dynamic article found
  if (!article) return <Navigate to="/experience" replace />;

  const renderTextContent = (data, type) => {
    const isCenterText = type === 'center-text';
    const isOnlyParagraph = isCenterText && !data.showHeading && data.showParagraph;
    
    const headingStyle = isCenterText ? { fontFamily: "'Inter', sans-serif", fontSize: '72px', fontWeight: 400, maxWidth: '1000px', margin: '0 auto', lineHeight: '0.9', letterSpacing: 'normal' } : {};
    const descriptionStyle = isCenterText ? { maxWidth: '800px', margin: isOnlyParagraph ? '0 auto' : '40px auto 0' } : {};
    
    return (
      <>
        {data.showHeading && <h2 className={styles.title} style={headingStyle}>{data.heading}</h2>}
        {data.showParagraph && (
          <div className={styles.description} style={descriptionStyle}>
            {renderDescription(data.paragraph)}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* Cover Image */}
      {article.coverSettings?.isVisible !== false && article.coverImage && (
        <div className={styles.heroSection} style={{ position: 'relative' }}>
          <img src={article.coverImage} alt={article.title} className={styles.heroImage} style={{ objectFit: 'cover', width: '100%', aspectRatio: '21 / 9', display: 'block' }} />
          
          {article.coverSettings?.showTitle && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <h1 style={{ fontFamily: "'Jacopo Mediaeval', serif", fontSize: '88px', fontWeight: 400, color: '#fff', textAlign: 'center', textShadow: '0 4px 20px rgba(0,0,0,0.5)', margin: 0, padding: '0 20px' }}>
                {article.title}
              </h1>
            </div>
          )}
        </div>
      )}

      {article.modules.filter(m => m.isVisible).map(mod => {
        const { type, data, id: modId } = mod;
        
        if (type === 'full-image') {
          return (
            <div key={modId} className={styles.moduleFullImage}>
              <img src={data.image || "https://images.unsplash.com/photo-1593214451196-37e0651f8ef2?q=80&w=1920&auto=format&fit=crop"} alt={data.heading} />
            </div>
          );
        }

        if (type === 'split-left-image') {
          return (
            <div key={modId} className={`${styles.row} ${styles.rowNormal}`} style={{ margin: '40px 0' }}>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <img src={data.image || "/images/blue_beyond.png"} className={styles.image} alt={data.heading} />
                </div>
              </div>
              <div className={styles.textColumn}>
                {renderTextContent(data, type)}
              </div>
            </div>
          );
        }

        if (type === 'split-right-image') {
          return (
            <div key={modId} className={`${styles.row} ${styles.rowReverse}`} style={{ margin: '40px 0' }}>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <img src={data.image || "/images/blue_beyond.png"} className={styles.image} alt={data.heading} />
                </div>
              </div>
              <div className={styles.textColumn}>
                {renderTextContent(data, type)}
              </div>
            </div>
          );
        }

        if (type === 'center-text') {
          const isOnlyParagraph = !data.showHeading && data.showParagraph;
          const containerMargin = isOnlyParagraph ? '60px 0' : '120px 0';
          
          return (
            <div key={modId} className={styles.row} style={{ justifyContent: 'center', margin: containerMargin }}>
              <div className={styles.textColumn} style={{ width: '100%', alignItems: 'center', textAlign: 'center', paddingTop: 0 }}>
                {renderTextContent(data, type)}
              </div>
            </div>
          );
        }

        if (type === 'product-grid') {
          const selectedIds = data.productIds || [];
          if (selectedIds.length === 0) return null;

          return (
            <div key={modId} className={styles.relatedSection}>
              <div className={styles.showcaseGrid}>
                {selectedIds.map((pid) => {
                  const product = products.find(p => p.id === pid);
                  if (!product) return null;
                  const brand = brands.find(b => b.id === product.brandId);
                  
                  return (
                    <div 
                      key={product.id} 
                      className={styles.showcaseItem} 
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.showcaseHeader}>
                        <span className={styles.showcaseBrand}>{brand?.name || 'Unknown Brand'}</span>
                      </div>
                      <div className={styles.showcaseImageContainer}>
                        <img src={product.image} alt={brand?.name} className={styles.showcaseImage} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        if (type === 'chat-button') {
          return (
            <div key={modId} className={styles.chatBtnContainer}>
              <button 
                className={styles.chatWithStylistBtn}
                onClick={() => {
                  const message = `สวัสดีค่ะ สนใจสอบถามข้อมูลเพิ่มเติมจากหน้าบทความ ${article.title}`;
                  window.open(`https://line.me/R/oaMessage/@moreyes/?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                <div className={styles.lineCircle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.967C23.156 14.375 24 12.459 24 10.314" />
                  </svg>
                </div>
                {data.text || 'CHAT WITH STYLIST'}
              </button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default BespokeDetailPage;
