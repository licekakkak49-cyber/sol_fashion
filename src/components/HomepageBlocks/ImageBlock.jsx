import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import styles from './HomepageBlocks.module.css';

const ImageBlock = ({ data, isPreview }) => {
  const imageUrl = data?.imageUrl;
  const videoUrl = data?.videoUrl;
  const isVideo = data?.mediaType === 'video' ? Boolean(videoUrl) : Boolean(videoUrl && !imageUrl);
  
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
  const titleFontSize = data?.titleFontSize || '24px';

  const paragraph = data?.paragraph?.trim();
  const paragraphFontSize = data?.paragraphFontSize || '14px';

  const linkText = data?.linkText?.trim();
  const linkUrl = data?.linkUrl?.trim() || '#';
  const linkFontSize = data?.linkFontSize || '14px';

  const hasOverlay = Boolean(data?.hasOverlay || eyebrow || title || paragraph || linkText);
  const textColor = data?.overlayTextColor || '#ffffff';
  const isWhite = textColor === '#ffffff';

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#111' }}>
      {isVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <img 
          src={imageUrl} 
          alt="Block" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
        />
      )}

      {/* Play / Pause button */}
      {isVideo && (
        <button
          type="button"
          onClick={togglePlay}
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 10,
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '4px',
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
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
      )}

      {/* Mute / Unmute button */}
      {isVideo && (
        <button
          type="button"
          onClick={toggleMute}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: 10,
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '4px',
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
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      )}

      {((hasOverlay && isWhite) || isVideo) && (
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '55%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}

      {hasOverlay && (
        <div 
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '16px',
            right: '16px',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: textColor,
            pointerEvents: 'auto'
          }}
        >
          {eyebrow && (
            <div 
              style={{
                fontSize: eyebrowFontSize,
                fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 500,
                color: isWhite ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.7)',
                marginBottom: '6px',
                lineHeight: 1.2
              }}
            >
              {eyebrow}
            </div>
          )}

          {title && (
            <h3 
              style={{
                fontSize: titleFontSize,
                fontWeight: 400,
                fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                color: textColor,
                lineHeight: 1.25,
                margin: '0 0 8px 0',
                whiteSpace: 'pre-line',
                textShadow: isWhite ? '0 2px 8px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              {title}
            </h3>
          )}

          {paragraph && (
            <p 
              style={{
                fontSize: paragraphFontSize,
                fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                color: isWhite ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                lineHeight: 1.4,
                margin: '0 0 10px 0',
                whiteSpace: 'pre-line'
              }}
            >
              {paragraph}
            </p>
          )}

          {linkText && (
            <div>
              {isPreview ? (
                <span 
                  className={styles.animatedUnderline}
                  style={{
                    fontSize: linkFontSize,
                    fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                    color: textColor,
                    fontWeight: 500,
                    display: 'inline-block'
                  }}
                >
                  {linkText}
                </span>
              ) : (
                <Link 
                  to={linkUrl}
                  className={styles.animatedUnderline}
                  style={{
                    fontSize: linkFontSize,
                    fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
                    color: textColor,
                    fontWeight: 500,
                    display: 'inline-block'
                  }}
                >
                  {linkText}
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {!hasOverlay && data?.linkUrl && !isPreview && (
        <Link to={data.linkUrl} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
      )}
    </div>
  );
};

export default ImageBlock;
