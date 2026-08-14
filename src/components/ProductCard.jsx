import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import styles from './ProductCard.module.css';

const HeartIcon = ({ size = 20, color = "currentColor", strokeWidth = 1.2, fill = "none", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="miter" className={className}>
    <path d="M12 21.5l-8.5-8.5a5.5 5.5 0 0 1 0-7.78 5.5 5.5 0 0 1 7.78 0L12 6.5l.72-.72a5.5 5.5 0 0 1 7.78 0 5.5 5.5 0 0 1 0 7.78l-8.5 8.5z" />
  </svg>
);

const ProductCard = ({ id, image, name, price, tags = [], colors = [], selectedColor, extraColorsCount, minimal = false, hideBookmark = false, isLarge = false, overlayMode = false }) => {
  const { toggleWishlist, openWishlistPopup, isInWishlist } = useWishlist();
  
  const isSaved = isInWishlist(id);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    const product = { id, image, name, price };
    toggleWishlist(product);
    if (!isSaved) {
      openWishlistPopup(product);
    }
  };

  return (
    <Link to={`/product/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={`${styles.imageContainer} ${isLarge ? styles.largeImageContainer : ''}`}>
          <img src={image} alt={name} className={styles.image} />
          {tags && tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {tags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
          {!minimal && (
            <div className={styles.carouselArrows}>
              <button className={styles.arrowBtn} aria-label="Previous image" onClick={(e) => e.preventDefault()}>
                <ChevronLeft size={24} strokeWidth={1} />
              </button>
              <button className={styles.arrowBtn} aria-label="Next image" onClick={(e) => e.preventDefault()}>
                <ChevronRight size={24} strokeWidth={1} />
              </button>
            </div>
          )}
          {!minimal && colors && colors.length + (extraColorsCount || 0) > 1 && (
            <div className={styles.mobilePagination}>
              {Array.from({ length: colors.length + (extraColorsCount || 0) }).map((_, idx) => (
                <div key={idx} className={`${styles.dash} ${idx === 0 ? styles.activeDash : ''}`} />
              ))}
            </div>
          )}
          {!isLarge && colors && colors.length > 0 && (
            <div className={styles.hoverColorsContainer}>
              {colors.map((c, i) => (
                <div 
                  key={i} 
                  className={`${styles.colorSquare} ${c === selectedColor ? styles.selectedColor : ''}`} 
                  style={{ backgroundColor: c }}
                />
              ))}
              {extraColorsCount > 0 && (
                <span className={styles.extraColors}>+{extraColorsCount}</span>
              )}
            </div>
          )}
        </div>
        


        {!isLarge && (
          <div className={`${styles.details} ${overlayMode ? styles.overlayDetails : ''}`}>
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <h3 className={styles.name}>{name}</h3>
              </div>
              <div className={styles.priceRow}>
                <p className={styles.price}>
                  {price}
                </p>
              </div>
            </div>
            {!hideBookmark && (
              <button className={styles.bookmarkBtn} aria-label="Save product" onClick={handleBookmarkClick}>
                <HeartIcon size={18} strokeWidth={1} fill={isSaved ? "currentColor" : "none"} className={styles.heartIconSvg} />
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
