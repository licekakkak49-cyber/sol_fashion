import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomepageBlocks.module.css';

const TextBlock = ({ data, isPreview }) => {
  const align = data?.alignment || 'left'; // 'left' or 'center'

  const eyebrow = data?.eyebrow?.trim();
  const eyebrowFontSize = data?.eyebrowFontSize || '12px';

  const title = data?.title?.trim();
  const titleFontSize = data?.titleFontSize || '32px';

  const paragraph = data?.paragraph?.trim();
  const paragraphFontSize = data?.paragraphFontSize || '16px';

  const linkText = data?.linkText?.trim();
  const linkUrl = data?.linkUrl?.trim() || '#';
  const linkFontSize = data?.linkFontSize || '15px';

  const hasContent = Boolean(eyebrow || title || paragraph || linkText);
  if (!hasContent && !isPreview) return null;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: align === 'left' ? 'flex-start' : 'center',
      minHeight: '100px', 
      textAlign: align,
      width: '100%',
      backgroundColor: 'transparent',
      padding: '24px 0',
      boxSizing: 'border-box'
    }}>
      {/* 1. Eyebrow */}
      {eyebrow && (
        <div style={{
          fontSize: eyebrowFontSize,
          fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          fontWeight: 500,
          color: '#666666',
          marginBottom: '8px',
          lineHeight: 1.3
        }}>
          {eyebrow}
        </div>
      )}

      {/* 2. Main Title */}
      {title && (
        <h2 style={{ 
          fontSize: titleFontSize, 
          margin: '0 0 10px 0', 
          fontWeight: 400, 
          fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
          color: '#111111',
          lineHeight: 1.25,
          whiteSpace: 'pre-line' // Preserve multi-line breaks
        }}>
          {title}
        </h2>
      )}

      {/* 3. Paragraph */}
      {paragraph && (
        <p style={{
          fontSize: paragraphFontSize,
          fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif",
          color: '#444444',
          lineHeight: 1.6,
          margin: '0 0 16px 0',
          whiteSpace: 'pre-line', // Preserve multi-line breaks
          maxWidth: '720px'
        }}>
          {paragraph}
        </p>
      )}
      
      {/* 4. Action Link (Underlined with Footer-style Animated Effect) */}
      {linkText && (
        <div style={{ marginTop: (!eyebrow && !title && !paragraph) ? '0' : '4px' }}>
          {isPreview ? (
            <span
              className={styles.animatedUnderline}
              style={{ 
                fontSize: linkFontSize, 
                fontFamily: "'Futura PT', 'Helvetica Neue', Arial, sans-serif", 
                letterSpacing: '0.04em', 
                color: '#111111', 
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
                letterSpacing: '0.04em', 
                color: '#111111', 
                fontWeight: 500,
                display: 'inline-block'
              }}
            >
              {linkText}
            </Link>
          )}
        </div>
      )}

      {/* Empty fallback for admin canvas */}
      {!hasContent && isPreview && (
        <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>
          (Empty Text Module — Click to edit)
        </div>
      )}
    </div>
  );
};

export default TextBlock;
