import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatCurrency';
import { isVideoMedia } from '../utils/supabaseStorage';
import styles from './ProductCard.module.css';

const HeartIcon = ({ size = 20, color = "currentColor", strokeWidth = 1.2, fill = "none", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="miter" className={className}>
    <path d="M12 21.5l-8.5-8.5a5.5 5.5 0 0 1 0-7.78 5.5 5.5 0 0 1 7.78 0L12 6.5l.72-.72a5.5 5.5 0 0 1 7.78 0 5.5 5.5 0 0 1 0 7.78l-8.5 8.5z" />
  </svg>
);

const ProductCard = ({ id, image, hoverImage, name, price, tags = [], colors = [], colorVariants = [], selectedColor, extraColorsCount, minimal = false, hideBookmark = false, isLarge = false, overlayMode = false }) => {
  const { toggleWishlist, openWishlistPopup, isInWishlist } = useWishlist();
  const [manualFlip, setManualFlip] = React.useState(null); // null, true, false
  const [activeVariantIdx, setActiveVariantIdx] = React.useState(() => {
    if (!colorVariants || colorVariants.length === 0) return -1;
    const mainIdx = colorVariants.findIndex(v => v.isMain);
    return mainIdx >= 0 ? mainIdx : 0;
  });
  
  const isSaved = isInWishlist(id);

  // Video controls state for large 2x2 cards
  const isVideo = isLarge && isVideoMedia(image);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  let currentImage = image;
  let currentHoverImage = hoverImage;
  
  if (activeVariantIdx >= 0 && colorVariants[activeVariantIdx]?.images?.length > 0) {
    currentImage = colorVariants[activeVariantIdx].images[0];
    currentHoverImage = colorVariants[activeVariantIdx].images[1] || null;
  } else if (activeVariantIdx >= 0 && colorVariants[activeVariantIdx]?.image) {
    // Legacy support
    currentImage = colorVariants[activeVariantIdx].image;
    currentHoverImage = null;
  }

  const images = currentHoverImage ? [currentImage, currentHoverImage] : [currentImage];

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    const product = { id, image: currentImage, name, price: formatCurrency(price) };
    toggleWishlist(product);
    if (!isSaved) {
      openWishlistPopup(product);
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    if (currentHoverImage) setManualFlip(true);
  };

  const prevImage = (e) => {
    e.preventDefault();
    if (currentHoverImage) setManualFlip(false);
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
      <div className={`${styles.card} ${overlayMode ? styles.isOverlayMode : ''}`}>
        <div 
          className={`${styles.imageContainer} ${isLarge ? styles.largeImageContainer : ''} ${hoverImage && !isVideo ? styles.hasHoverImage : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isVideo ? (
            <div className={styles.videoWrapper}>
              <video
                ref={videoRef}
                src={image}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className={styles.image}
                style={{ objectFit: 'cover' }}
              />
              
              {/* Subtle bottom gradient to guarantee button contrast */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />

              {/* Minimal Bottom-Left Play/Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className={styles.videoControlBtn}
                aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '1px' }} />}
              </button>

              {/* Minimal Bottom-Right Mute/Unmute */}
              <button
                type="button"
                onClick={toggleMute}
                className={`${styles.videoControlBtn} ${styles.videoMuteBtn}`}
                aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
          ) : (
            <>
              <img src={image} alt={name} className={`${styles.image} ${manualFlip === true ? styles.forceHide : ''} ${manualFlip === false ? styles.forceShow : ''}`} />
              {hoverImage && (
                <img src={hoverImage} alt={`${name} hover`} className={`${styles.hoverImage} ${manualFlip === true ? styles.forceShow : ''} ${manualFlip === false ? styles.forceHide : ''}`} />
              )}
            </>
          )}
          
          {tags && tags.length > 0 && (
            <div className={`${styles.tagsContainer} ${styles.desktopTags}`}>
              {tags.map((tag, idx) => (
                <span key={idx} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
          {!minimal && !isVideo && images.length > 1 && (
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
                        onClick={(e) => { e.preventDefault(); setActiveVariantIdx(activeVariantIdx === i ? -1 : i); }}
                        className={`${styles.colorSquare} ${(activeVariantIdx === i || (activeVariantIdx === -1 && c === selectedColor)) ? styles.selectedColor : ''}`} 
                        style={{ backgroundColor: c, cursor: 'pointer' }}
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
                  {formatCurrency(price)}
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
