import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ id, image, name, price, status, minimal = false, hideBookmark = false }) => {
  const { toggleWishlist, openWishlistPopup, isInWishlist } = useWishlist();
  
  const isSaved = isInWishlist(id);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    const product = { id, image, name, price, status };
    toggleWishlist(product);
    if (!isSaved) {
      openWishlistPopup(product);
    }
  };

  return (
    <Link to={`/product/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img src={image} alt={name} className={styles.image} />
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
        </div>
        
        {!minimal && (
          <div className={styles.pagination}>
            <div className={`${styles.dash} ${styles.activeDash}`}></div>
            <div className={styles.dash}></div>
            <div className={styles.dash}></div>
            <div className={styles.dash}></div>
          </div>
        )}

        <div className={styles.details}>
          <div className={styles.info}>
            <h3 className={styles.name}>{name}</h3>
            <div className={styles.priceRow}>
              <p className={styles.price}>
                {price} {status && <span className={styles.status}>- {status}</span>}
              </p>
              <button 
                className={styles.inlineInquireBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const message = `สวัสดีค่ะ สนใจแว่นรุ่น: ${name} ราคา: ${price} บาท`;
                  window.open(`https://line.me/R/oaMessage/@moreyes/?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                INQUIRE
              </button>
            </div>
          </div>
          {!hideBookmark && (
            <button className={styles.bookmarkBtn} aria-label="Save product" onClick={handleBookmarkClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M19 21l-7-5-7 5V3h14v18z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
