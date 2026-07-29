import React, { useState, useEffect } from 'react';
import styles from './BespokeDetailPage.module.css';

const BespokeDynamicPage = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('mockBespokeModules');
    if (saved) {
      setModules(JSON.parse(saved));
    }
  }, []);

  const renderDescription = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <p key={index} style={{ margin: '5px 0' }}>{line}</p>
    ));
  };

  const renderTextContent = (data) => (
    <>
      {data.showHeading && <h2 className={styles.title}>{data.heading}</h2>}
      {data.showParagraph && (
        <div className={styles.description}>
          {renderDescription(data.paragraph)}
        </div>
      )}
    </>
  );

  return (
    <div className={styles.pageContainer}>
      {modules.filter(m => m.isVisible).map(mod => {
        const { type, data, id } = mod;
        
        if (type === 'full-image') {
          return (
            <div key={id} className={styles.heroSection}>
              <img src={data.image || "https://images.unsplash.com/photo-1593214451196-37e0651f8ef2?q=80&w=1920&auto=format&fit=crop"} alt={data.heading} className={styles.heroImage} />
            </div>
          );
        }

        if (type === 'split-left-image') {
          return (
            <div key={id} className={`${styles.row} ${styles.rowNormal}`}>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <img src={data.image || "/images/blue_beyond.png"} className={styles.image} alt={data.heading} />
                </div>
              </div>
              <div className={styles.textColumn}>
                {renderTextContent(data)}
              </div>
            </div>
          );
        }

        if (type === 'split-right-image') {
          return (
            <div key={id} className={`${styles.row} ${styles.rowReverse}`}>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <img src={data.image || "/images/blue_beyond.png"} className={styles.image} alt={data.heading} />
                </div>
              </div>
              <div className={styles.textColumn}>
                {renderTextContent(data)}
              </div>
            </div>
          );
        }

        if (type === 'center-text') {
          return (
            <div key={id} className={styles.row} style={{ justifyContent: 'center' }}>
              <div className={styles.textColumn} style={{ width: '100%', alignItems: 'center', textAlign: 'center', paddingTop: '40px' }}>
                {renderTextContent(data)}
              </div>
            </div>
          );
        }

        if (type === 'product-grid') {
          return (
            <div key={id} className={styles.relatedSection} style={{ textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', letterSpacing: '0.15em', marginBottom: '40px' }}>{data.heading || 'FEATURED PRODUCTS'}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>[ Product grid will render here from catalog ]</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default BespokeDynamicPage;
