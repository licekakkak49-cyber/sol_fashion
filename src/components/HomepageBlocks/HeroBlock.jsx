import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import styles from '../HeroSection.module.css'; 
import blockStyles from './HomepageBlocks.module.css'; 

const HeroBlock = ({ data, isPreview }) => {
  const imageUrl = data?.imageUrl || data?.bgImage;
  const videoUrl = data?.videoUrl;
  const isVideo = data?.mediaType === 'video' ? Boolean(videoUrl) : Boolean(videoUrl && !imageUrl);
  const objectPosition = data?.objectPosition || 'center';
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  if (!imageUrl && !videoUrl) return null;

  const togglePlay = (e) => {
    e.stopPropagation();
    e.preventDefault();
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
    e.stopPropagation();
    e.preventDefault();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const eyebrow = data?.eyebrow?.trim();
  const eyebrowFontSize = data?.eyebrowFontSize || '12px';

  const title = data?.title?.trim();
  const titleFontSize = data?.titleFontSize || '32px';

  const paragraph = data?.paragraph?.trim();
  const paragraphFontSize = data?.paragraphFontSize || '16px';

  const linkText = data?.linkText?.trim();
  const linkUrl = data?.linkUrl?.trim() || '#';
  const linkFontSize = data?.linkFontSize || '15px';

  const hasOverlay = Boolean(data?.hasOverlay || eyebrow || title || paragraph || linkText);
  const textColor = data?.overlayTextColor || '#ffffff';
  const isWhite = textColor === '#ffffff';

  return (
    <section 
      className={styles.hero} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden',
        backgroundColor: '#111' 
      }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className={styles.heroBg}
          style={{
            objectPosition,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      ) : (
        <img 
          src={imageUrl} 
          alt="Hero" 
          className={styles.heroBg} 
          style={{ 
            objectPosition, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: 'block'
          }} 
        />
      )}

      {/* Subtle bottom vignette to ensure white text & control buttons readability */}
      {((hasOverlay && isWhite) || isVideo) && (
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}

      {/* Bottom-Left Play/Pause Video Control (Louis Vuitton Minimal Style) */}
      {isVideo && (
        <button
          type="button"
          onClick={togglePlay}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            zIndex: 10,
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85,
            transition: 'opacity 0.2s ease, transform 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '0.85';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      )}

      {/* Bottom-Right Mute/Unmute Video Control (Louis Vuitton Minimal Style) */}
      {isVideo && (
        <button
          type="button"
          onClick={toggleMute}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            zIndex: 10,
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85,
            transition: 'opacity 0.2s ease, transform 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '0.85';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      {/* Overlay Typography Content (Bottom-Center luxury styling) */}
      {hasOverlay && (
        <div 
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            right: '60px',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: textColor,
            pointerEvents: 'auto'
          }}
        >
          {/* 1. Eyebrow */}
          {eyebrow && (
            <div 
              style={{
                fontSize: eyebrowFontSize,
                fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                fontWeight: 500,
                color: isWhite ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.7)',
                marginBottom: '8px',
                textShadow: isWhite ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
                lineHeight: 1.3
              }}
            >
              {eyebrow}
            </div>
          )}

          {/* 2. Main Title */}
          {title && (
            <h2 
              style={{
                fontSize: titleFontSize,
                fontWeight: 400,
                fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                color: textColor,
                lineHeight: 1.25,
                margin: '0 0 10px 0',
                whiteSpace: 'pre-line',
                textShadow: isWhite ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
                maxWidth: '820px'
              }}
            >
              {title}
            </h2>
          )}

          {/* 3. Paragraph */}
          {paragraph && (
            <p 
              style={{
                fontSize: paragraphFontSize,
                fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                color: isWhite ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                lineHeight: 1.55,
                margin: '0 0 14px 0',
                whiteSpace: 'pre-line',
                maxWidth: '680px',
                textShadow: isWhite ? '0 1px 6px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              {paragraph}
            </p>
          )}

          {/* 4. Action Link (Underlined) */}
          {linkText && (
            <div style={{ marginTop: (!eyebrow && !title && !paragraph) ? '0' : '4px' }}>
              {isPreview ? (
                <span 
                  className={blockStyles.animatedUnderline}
                  style={{
                    fontSize: linkFontSize,
                    fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                    letterSpacing: '0.04em',
                    color: textColor,
                    fontWeight: 500,
                    display: 'inline-block',
                    textShadow: isWhite ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
                  }}
                >
                  {linkText}
                </span>
              ) : (
                <Link 
                  to={linkUrl}
                  className={blockStyles.animatedUnderline}
                  style={{
                    fontSize: linkFontSize,
                    fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                    letterSpacing: '0.04em',
                    color: textColor,
                    fontWeight: 500,
                    display: 'inline-block',
                    textShadow: isWhite ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
                  }}
                >
                  {linkText}
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fallback full-block link only if no overlay and not video */}
      {!hasOverlay && !isVideo && data?.linkUrl && !isPreview && (
        <Link 
          to={data.linkUrl} 
          style={{ position: 'absolute', inset: 0, zIndex: 1 }} 
          aria-label="Hero Link" 
        />
      )}
    </section>
  );
};

export default HeroBlock;
