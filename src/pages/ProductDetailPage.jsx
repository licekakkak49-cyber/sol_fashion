import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bookmark, X, Plus, Minus } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import styles from './ProductDetailPage.module.css';

const MOCK_IMAGES = [
  "https://www.keringeyewear.com/dam/jcr:1b521430-17e7-4319-b734-ff8d48428ccd/KeringEyewear_Website_Thumbnails_thintanium_5350_K292_PGT%20(1).jpg",
  "https://www.keringeyewear.com/dam/jcr:5bf188d9-23ab-4f6a-b304-94d5b7a40f2c/KeringEyewear_Website_Thumbnails_blok_4251_10%20(1).jpg",
  "https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg"
];

const SIMILAR_PRODUCTS = [
  { id: 'similar-1', image: "https://www.keringeyewear.com/dam/jcr:5bf188d9-23ab-4f6a-b304-94d5b7a40f2c/KeringEyewear_Website_Thumbnails_blok_4251_10%20(1).jpg", name: "Gamot 02(GR)", price: "฿ 9,020.00" },
  { id: 'similar-2', image: "https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg", name: "Rollie 02(BR)", price: "฿ 7,920.00" },
  { id: 'similar-3', image: "https://www.keringeyewear.com/dam/jcr:1b521430-17e7-4319-b734-ff8d48428ccd/KeringEyewear_Website_Thumbnails_thintanium_5350_K292_PGT%20(1).jpg", name: "Brutal 02", price: "฿ 10,480.00" },
  { id: 'similar-4', image: "https://www.keringeyewear.com/dam/jcr:cb990dd9-9732-4075-a5a2-52757c778132/KeringEyewear_Website_Thumbnails_rim_82028_SL112_10%20(1).jpg", name: "Tetra 02", price: "฿ 10,320.00" },
  { id: 'similar-5', image: "https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg", name: "Vanta 02(G)", price: "฿ 9,320.00" }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [showBanner, setShowBanner] = useState(true);
  const [expandedSections, setExpandedSections] = useState({ SHIPPING: true });
  const [unit, setUnit] = useState('MM');
  const [frameFront, setFrameFront] = useState(142);
  const [lensHeight, setLensHeight] = useState(29.7);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatValue = (val) => {
    if (unit === 'IN') {
      return (val / 25.4).toFixed(2) + ' in';
    }
    return val % 1 !== 0 ? val.toFixed(1) + ' mm' : val + ' mm';
  };

  return (
    <div className={styles.page}>
      {/* Promo Banner - Fixed top right */}
      {showBanner && (
        <div className={styles.promoBanner}>
          <p>The doll keyring giveaway promotion for online Veggie Collection orders has ended.</p>
          <button className={styles.closeBanner} onClick={() => setShowBanner(false)}>
            <X size={12} strokeWidth={1} />
          </button>
        </div>
      )}

      <div className={styles.layout}>
        {/* Left Column: Scrollable Images */}
        <div className={styles.leftColumn}>
          {MOCK_IMAGES.map((img, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img src={img} alt={`Product view ${index + 1}`} className={styles.image} />
            </div>
          ))}
        </div>

        {/* Right Column: Sticky Details */}
        <div className={styles.rightColumn}>
          <div className={styles.stickyContent}>
            
            {/* Title & Price */}
            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.title}>Mori 02(BR)</h1>
                <p className={styles.price}>
                  ฿ 10,180.00 <span className={styles.status}>- To be restocked</span>
                </p>
              </div>
              <button className={styles.bookmarkBtn} aria-label="Save product">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M19 21l-7-5-7 5V3h14v18z" />
                </svg>
              </button>
            </div>

            {/* Color Swatches */}
            <div className={styles.colorSection}>
              <div className={styles.swatches}>
                <button className={`${styles.swatchWrapper} ${styles.activeSwatch}`}>
                  <div className={styles.swatch} style={{ background: 'linear-gradient(135deg, #d8dade 50%, #f5f5f5 50%)' }} />
                </button>
                <button className={styles.swatchWrapper}>
                  <div className={styles.swatch} style={{ background: 'linear-gradient(135deg, #d8dade 50%, #c4cdb6 50%)' }} />
                </button>
                <button className={styles.swatchWrapper}>
                  <div className={styles.swatch} style={{ background: 'linear-gradient(135deg, #d8dade 50%, #6e5445 50%)' }} />
                </button>
              </div>
              <span className={styles.colorLabel}>Silver / Brown</span>
            </div>

            {/* Action Button */}
            <button 
              className={styles.actionBtn}
              onClick={(e) => {
                e.preventDefault();
                const message = `สวัสดีค่ะ สนใจแว่นรุ่น: Mori 02(BR) ราคา: 10,180.00 บาท`;
                window.open(`https://line.me/R/oaMessage/@moreyes/?text=${encodeURIComponent(message)}`, '_blank');
              }}
            >
              <div className={styles.lineCircle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.967C23.156 14.375 24 12.459 24 10.314" />
                </svg>
              </div>
              CHAT WITH STYLIST
            </button>

            {/* Accordions */}
            <div className={styles.accordions}>
              {/* Shipping */}
              <div className={styles.accordionItem}>
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => toggleSection('SHIPPING')}
                >
                  <span>SHIPPING & RETURNS I IMPORT DUTY & TAX</span>
                  <div className={`${styles.toggleIcon} ${expandedSections['SHIPPING'] ? styles.expanded : ''}`}>
                    <div className={styles.toggleLine}></div>
                    <div className={`${styles.toggleLine} ${styles.toggleLineVertical}`}></div>
                  </div>
                </button>
                <div className={`${styles.accordionContentWrapper} ${expandedSections['SHIPPING'] ? styles.expandedContent : ''}`}>
                  <div className={styles.accordionContent}>
                    <div className={styles.accordionContentInner}>
                      <p>Gentle Monster provides free shipping.<br/>
                      Please allow up to 5-7 business days for your order to be processed and shipped. Returns may be made within 7 days from the date of delivery.</p>
                      <br/>
                      <p>All prices shown on the website include applicable duties and taxes for your country, so there are no additional customs duties or import fees to pay upon delivery.<br/>
                      Please note that if a package is refused or returned after shipment has been initiated, the delivery fee will be deducted from your refund for the product you've sent back.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className={styles.accordionItem}>
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => toggleSection('DETAILS')}
                >
                  <span>DETAILS</span>
                  <div className={`${styles.toggleIcon} ${expandedSections['DETAILS'] ? styles.expanded : ''}`}>
                    <div className={styles.toggleLine}></div>
                    <div className={`${styles.toggleLine} ${styles.toggleLineVertical}`}></div>
                  </div>
                </button>
                <div className={`${styles.accordionContentWrapper} ${expandedSections['DETAILS'] ? styles.expandedContent : ''}`}>
                  <div className={styles.accordionContent}>
                    <div className={styles.accordionContentInner}>
                      <p>Square Glasses in Glossy Silver Metal</p>
                      <br />
                      <p>Veggie Collection<br/>
                      Silver Metal Foldable Frame<br/>
                      Clear Lenses<br/>
                      Square Shape<br/>
                      Lenses Block Blue Light and 99.9% of UV Rays<br/>
                      Manufacturer & Importer: IICOMBINED CO., LTD.<br/>
                      Country of Manufacturer: China</p>
                      <br />
                      <p>Not eligible for fitting customization</p>
                      <br />
                      <p>The dot keyring giveaway promotion for online Veggie Collection orders has ended.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size and Fit */}
              <div className={styles.accordionItem}>
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => toggleSection('SIZE')}
                >
                  <span>SIZE AND FIT</span>
                  <div className={`${styles.toggleIcon} ${expandedSections['SIZE'] ? styles.expanded : ''}`}>
                    <div className={styles.toggleLine}></div>
                    <div className={`${styles.toggleLine} ${styles.toggleLineVertical}`}></div>
                  </div>
                </button>
                <div className={`${styles.accordionContentWrapper} ${expandedSections['SIZE'] ? styles.expandedContent : ''}`}>
                  <div className={styles.accordionContent}>
                    <div className={styles.accordionContentInner}>
                      <div className={styles.unitToggle}>
                        <button 
                          className={`${styles.unitBtn} ${unit === 'MM' ? styles.activeUnit : ''}`}
                          onClick={() => setUnit('MM')}
                        >
                          MM
                        </button>
                        <button 
                          className={`${styles.unitBtn} ${unit === 'IN' ? styles.activeUnit : ''}`}
                          onClick={() => setUnit('IN')}
                        >
                          IN
                        </button>
                      </div>
                      
                      <div className={styles.sizeContainer}>
                        <div className={styles.sizeList}>
                          <p>Lens width: {formatValue(54)}</p>
                          <p>Bridge: {formatValue(20)}</p>
                          <p>Frame front: {formatValue(frameFront)}</p>
                          <p>Temple length: {formatValue(122.7)}</p>
                          <p>Lens height: {formatValue(lensHeight)}</p>
                        </div>
                        
                        <div className={styles.fitSliders}>
                          <p className={styles.fitLabel}>Fit</p>
                          
                          <div className={styles.sliderGroup}>
                            <div className={styles.sliderLabels}>
                              <span>NARROW</span>
                              <span>WIDE</span>
                            </div>
                            <input 
                              type="range" 
                              min="130" 
                              max="160" 
                              step="0.1"
                              value={frameFront} 
                              onChange={(e) => setFrameFront(parseFloat(e.target.value))}
                              className={styles.slider}
                            />
                          </div>
                          
                          <div className={styles.sliderGroup}>
                            <div className={styles.sliderLabels}>
                              <span>LOW</span>
                              <span>HIGH</span>
                            </div>
                            <input 
                              type="range" 
                              min="20" 
                              max="40" 
                              step="0.1"
                              value={lensHeight} 
                              onChange={(e) => setLensHeight(parseFloat(e.target.value))}
                              className={styles.slider}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Similar Frames */}
      <div className={styles.similarFrames}>
        <h2 className={styles.similarFramesTitle}>SIMILAR FRAMES</h2>
        <div className={styles.similarFramesList}>
          {SIMILAR_PRODUCTS.map(product => (
            <div key={product.id} className={styles.similarFrameCard}>
              <ProductCard {...product} minimal={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
