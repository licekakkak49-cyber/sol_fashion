import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, X, Plus, Minus, ShoppingBag, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import styles from './ProductDetailPage.module.css';

const MOCK_IMAGES = [
  "https://www.keringeyewear.com/dam/jcr:1b521430-17e7-4319-b734-ff8d48428ccd/KeringEyewear_Website_Thumbnails_thintanium_5350_K292_PGT%20(1).jpg",
  "https://www.keringeyewear.com/dam/jcr:5bf188d9-23ab-4f6a-b304-94d5b7a40f2c/KeringEyewear_Website_Thumbnails_blok_4251_10%20(1).jpg",
  "https://www.keringeyewear.com/dam/jcr:7950e987-62e3-42a2-ad5b-315c0d897664/KeringEyewear_Website_Thumbnails_now_6665_C04_10%20(1).jpg"
];


const ProductDetailPage = () => {
  const { id } = useParams();
  const { products } = useAdmin();
  const product = products?.find(p => p.id === id) || null;
  const { wishlist } = useWishlist();
  const wishlistProductFound = wishlist?.find(p => p.id === id) || null;

  const similarScrollRef = useRef(null);
  const [similarScrollState, setSimilarScrollState] = useState({
    isAtStart: true,
    isAtEnd: false
  });
  const [isMobileSizeDrawerOpen, setIsMobileSizeDrawerOpen] = useState(false);

  const handleSimilarScroll = () => {
    if (similarScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = similarScrollRef.current;
      setSimilarScrollState({
        isAtStart: scrollLeft <= 10,
        isAtEnd: scrollLeft + clientWidth >= scrollWidth - 10
      });
    }
  };

  useEffect(() => {
    // Check initial state once products are loaded
    handleSimilarScroll();
    
    // Add resize listener to handle orientation changes
    window.addEventListener('resize', handleSimilarScroll);
    return () => window.removeEventListener('resize', handleSimilarScroll);
  }, []);

  const scrollSimilar = (direction) => {
    if (similarScrollRef.current) {
      const scrollAmount = similarScrollRef.current.clientWidth;
      similarScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const displayImages = product 
    ? (product.hoverImage ? [product.image, product.hoverImage] : [product.image]) 
    : MOCK_IMAGES;
  
  const { toggleWishlist, openWishlistPopup, isInWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  const wishlistProduct = product || wishlistProductFound || {
    id: id || 'mock-product-id',
    name: 'Mori 02(BR)',
    price: '฿ 10,180.00',
    image: MOCK_IMAGES[0]
  };

  const isSaved = isInWishlist(wishlistProduct.id);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    toggleWishlist(wishlistProduct);
    if (!isSaved) {
      openWishlistPopup(wishlistProduct);
    }
  };
  
  const similarProducts = (products || []).filter(p => p.id !== id).slice(0, 4);

  const [expandedSections, setExpandedSections] = useState({ SHIPPING: true });
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [unit, setUnit] = useState('MM');
  const [frameFront, setFrameFront] = useState(142);
  const [lensHeight, setLensHeight] = useState(29.7);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageRefs = useRef([]);

  // Intersection Observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveImageIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.5 } // Triggers when 50% of the image is in view
    );

    const currentRefs = imageRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [displayImages]);

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
      <div className={styles.layout}>
        {/* Left Column: Scrollable Images */}
        <div className={styles.leftColumn}>
          {/* Scroll Indicators */}
          <div className={styles.indicatorContainer}>
            <div className={styles.indicators}>
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.indicatorLine} ${idx === activeImageIndex ? styles.activeIndicator : ''}`}
                  onClick={() => {
                    imageRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.imagesWrapper}>
            {displayImages.map((img, index) => (
              <div 
                key={index} 
                data-index={index}
                ref={(el) => (imageRefs.current[index] = el)}
                className={styles.imageWrapper}
              >
                <img src={img} alt={`${product?.name || 'Product'} view ${index + 1}`} className={styles.image} />
              </div>
            ))}
          </div>
          
          <div className={styles.mobilePagination}>
            {displayImages.length > 1 && displayImages.map((_, idx) => (
              <div key={idx} className={`${styles.dash} ${idx === activeImageIndex ? styles.activeDash : ''}`} />
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Details */}
        <div className={styles.rightColumn}>
          <div className={styles.stickyContent}>
            
            {/* Title & Price */}
            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.title}>{product ? product.name : 'Mori 02(BR)'}</h1>
                <p className={styles.subtitle}>Ruched fitted dress.</p>
                <p className={styles.price}>
                  {product ? product.price : '฿ 10,180.00'}
                </p>
              </div>
              <button className={styles.bookmarkBtn} onClick={handleBookmarkClick} aria-label="Save product">
                <Heart size={20} strokeWidth={1.2} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Color Swatches */}
            <div className={styles.colorSection}>
              <div className={styles.colorHeader}>
                <div className={styles.swatches}>
                  <button className={`${styles.swatchWrapper} ${styles.activeSwatch}`}>
                    <div className={styles.swatch} style={{ background: '#111' }} />
                  </button>
                  <button className={`${styles.swatchWrapper}`}>
                    <div className={styles.swatch} style={{ background: '#fff', border: '1px solid #ddd' }} />
                  </button>
                </div>
                <span className={styles.colorLabel}>Black</span>
              </div>
              <div className={styles.sectionDivider}></div>
            </div>

            {/* Size Section */}
            <div className={styles.sizeSection}>

              {/* Desktop view */}
              <div className={styles.desktopSizeSection}>
                <div className={styles.sizeHeader}>
                  <span className={styles.sizeLabel} style={sizeError ? { color: 'red' } : {}}>Size</span>
                  <button className={styles.sizeGuideBtn}>Size guide</button>
                </div>
                <div className={styles.sizeOptions}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size} 
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSizeBtn : ''}`}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile view */}
              <div className={styles.mobileSizeSection}>
                <button 
                  className={styles.mobileSizeSelectorBtn}
                  onClick={() => {
                    setSizeError(false);
                    setIsMobileSizeDrawerOpen(true);
                  }}
                  style={sizeError ? { borderBottom: '1px solid red' } : {}}
                >
                  <span className={styles.mobileSizeLabel}>Size</span>
                  <div className={styles.mobileSizeValueContainer}>
                    <span className={styles.mobileSizeValue}>
                      {selectedSize ? selectedSize : ''}
                    </span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </div>
                </button>
                <div className={styles.mobileSizeFooter}>
                  <button className={styles.sizeGuideBtn}>Size guide</button>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className={styles.actionBtn}
              onClick={(e) => {
                e.preventDefault();
                if (!selectedSize) {
                  setSizeError(true);
                  return;
                }
                addToCart(product || wishlistProduct, selectedSize);
                openCart();
              }}
            >
              <ShoppingBag size={14} strokeWidth={1.5} className={styles.bagIcon} />
              ADD TO CART
            </button>


            {/* Accordions */}
            <div className={styles.accordions}>
              
              {/* Details */}
              <div className={styles.accordionItem}>
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => toggleSection('DETAILS')}
                >
                  <span>Details</span>
                  <div className={`${styles.toggleIcon} ${expandedSections['DETAILS'] ? styles.expanded : ''}`}>
                    <div className={styles.toggleLine}></div>
                    <div className={`${styles.toggleLine} ${styles.toggleLineVertical}`}></div>
                  </div>
                </button>
                <div className={`${styles.accordionContentWrapper} ${expandedSections['DETAILS'] ? styles.expandedContent : ''}`}>
                  <div className={styles.accordionContent}>
                    <div className={styles.accordionContentInner}>
                      <p>Crafted with precision, this signature piece is designed for both comfort and understated elegance.</p>
                      <br />
                      <p>
                        • Premium quality fabric<br/>
                        • True to size fit<br/>
                        • Dry clean only<br/>
                        • Made in Italy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery and Returns */}
              <div className={styles.accordionItem}>
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => toggleSection('DELIVERY')}
                >
                  <span>Delivery and returns</span>
                  <div className={`${styles.toggleIcon} ${expandedSections['DELIVERY'] ? styles.expanded : ''}`}>
                    <div className={styles.toggleLine}></div>
                    <div className={`${styles.toggleLine} ${styles.toggleLineVertical}`}></div>
                  </div>
                </button>
                <div className={`${styles.accordionContentWrapper} ${expandedSections['DELIVERY'] ? styles.expandedContent : ''}`}>
                  <div className={styles.accordionContent}>
                    <div className={styles.accordionContentInner}>
                      <p>We offer complimentary standard shipping on all orders.<br/>
                      Standard delivery typically takes 3-5 business days to arrive.</p>
                      <br/>
                      <p>If you are not completely satisfied with your purchase, returns can be made within 14 days of delivery. All returned items must be in their original, unworn condition with all tags attached.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Us */}
              <div className={styles.accordionItem}>
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => toggleSection('CONTACT')}
                >
                  <span>Contact us</span>
                  <div className={`${styles.toggleIcon} ${expandedSections['CONTACT'] ? styles.expanded : ''}`}>
                    <div className={styles.toggleLine}></div>
                    <div className={`${styles.toggleLine} ${styles.toggleLineVertical}`}></div>
                  </div>
                </button>
                <div className={`${styles.accordionContentWrapper} ${expandedSections['CONTACT'] ? styles.expandedContent : ''}`}>
                  <div className={styles.accordionContent}>
                    <div className={styles.accordionContentInner}>
                      <p>Our Client Service team is available to assist you with any inquiries regarding our products, styling advice, or your order status.</p>
                      <br />
                      <p><strong>Email:</strong> customercare@solfashion.com</p>
                      <br />
                      <p>Response time: Within 24 hours during business days (Monday-Friday).</p>
                    </div>
                  </div>
                </div>
              </div>



            </div>

          </div>
        </div>
      </div>

      {/* Complete the look */}
      <div className={styles.similarFrames}>
        <h2 className={styles.similarFramesTitle}>Complete the look</h2>
        <div className={styles.similarFramesContainer}>
          <button 
            className={`${styles.similarNavBtn} ${styles.similarNavLeft} ${similarScrollState.isAtStart ? styles.hiddenBtn : ''}`} 
            onClick={() => scrollSimilar('left')}
          >
            <ChevronLeft size={24} strokeWidth={1} color="rgb(30,30,30)" />
          </button>
          
          <div className={styles.similarFramesList} ref={similarScrollRef} onScroll={handleSimilarScroll}>
            {similarProducts.map(similarProduct => (
              <div key={similarProduct.id} className={styles.similarFrameCard}>
                <ProductCard {...similarProduct} />
              </div>
            ))}
          </div>

          <button 
            className={`${styles.similarNavBtn} ${styles.similarNavRight} ${similarScrollState.isAtEnd ? styles.hiddenBtn : ''}`} 
            onClick={() => scrollSimilar('right')}
          >
            <ChevronRight size={24} strokeWidth={1} color="rgb(30,30,30)" />
          </button>
        </div>
      </div>

      {/* Breadcrumbs Mockup */}
      <div className={styles.bottomSection}>
        <div className={styles.breadcrumbs}>
          <span>Homepage — Women — </span>
          <span className={styles.currentBreadcrumb}>Beachwear</span>
        </div>
      </div>

      {/* Mobile Size Drawer */}
      <AnimatePresence>
        {isMobileSizeDrawerOpen && (
          <motion.div 
            className={styles.mobileSizeOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSizeDrawerOpen(false)}
          >
            <motion.div 
              className={styles.mobileSizeDrawer}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.mobileSizeDrawerHeader}>
                <h3 className={styles.mobileSizeDrawerTitle}>Size</h3>
                <button className={styles.mobileSizeDrawerClose} onClick={() => setIsMobileSizeDrawerOpen(false)}>
                  <X size={24} strokeWidth={1} />
                </button>
              </div>
              <div className={styles.mobileSizeDrawerContent}>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button 
                    key={size}
                    className={`${styles.mobileSizeOption} ${selectedSize === size ? styles.mobileSizeOptionSelected : ''}`}
                    onClick={() => {
                      setSelectedSize(size);
                      setIsMobileSizeDrawerOpen(false);
                    }}
                  >
                    <span>{size}</span>
                    {selectedSize === size && <span>✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
