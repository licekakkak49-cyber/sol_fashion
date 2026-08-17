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

const ProductCard = ({ id, image, hoverImage, name, price, tags = [], colors = [], selectedColor, extraColorsCount, minimal = false, hideBookmark = false, isLarge = false, overlayMode = false }) => {
  const { toggleWishlist, openWishlistPopup, isInWishlist } = useWishlist();
  const [manualFlip, setManualFlip] = React.useState(null); // null, true, false
  
  const isSaved = isInWishlist(id);

  const images = hoverImage ? [image, hoverImage] : [image];

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    const product = { id, image, name, price };
    toggleWishlist(product);
    if (!isSaved) {
      openWishlistPopup(product);
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    if (hoverImage) setManualFlip(true);
  };

  const prevImage = (e) => {
    e.preventDefault();
    if (hoverImage) setManualFlip(false);
  };

  let touchStartX = 0;
  const handleTouchStart = (e) => { touchStartX = e.changedTouches[0].screenX; };
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 40) prevImage(e);
    if (touchStartX - touchEndX > 40) nextImage(e);
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className={styles.cardLink}
      onMouseLeave={() => setManualFlip(null)}
    >
      <div className={styles.card}>
        <div 
          className={`${styles.imageContainer} ${isLarge ? styles.largeImageContainer : ''} ${hoverImage ? styles.hasHoverImage : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img src={image} alt={name} className={`${styles.image} ${manualFlip === true ? styles.forceHide : ''} ${manualFlip === false ? styles.forceShow : ''}`} />
          {hoverImage && (
            <img src={hoverImage} alt={`${name} hover`} className={`${styles.hoverImage} ${manualFlip === true ? styles.forceShow : ''} ${manualFlip === false ? styles.forceHide : ''}`} />
          )}
          
          {tags && tags.length > 0 && (
            <div className={`${styles.tagsContainer} ${styles.desktopTags}`}>
              {tags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
          {!minimal && images.length > 1 && (
            <div className={styles.carouselArrows}>
              <button className={styles.arrowBtn} aria-label="Previous image" onClick={prevImage}>
                <ChevronLeft size={20} strokeWidth={1} />
              </button>
              <button className={styles.arrowBtn} aria-label="Next image" onClick={nextImage}>
                <ChevronRight size={20} strokeWidth={1} />
              </button>
            </div>
          )}
        </div>
        


        {!isLarge && (
          <div className={`${styles.details} ${overlayMode ? styles.overlayDetails : ''}`}>
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <h3 className={styles.name}>{name}</h3>
                {colors && colors.length > 0 && (
                  <div className={styles.colorsInlineContainer}>
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
              <div className={styles.priceRow}>
                <p className={styles.price}>
                  {price}
                </p>
              </div>
              {tags && tags.length > 0 && (
                <div className={styles.mobileTags}>
                  {tags.map((tag, idx) => (
                    <span key={idx} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              )}
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
