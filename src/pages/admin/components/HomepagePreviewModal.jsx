import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import HomePage from '../../HomePage';

const HomepagePreviewModal = ({ items, onClose }) => {
  // Allow Esc key to close preview
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Intercept any click inside preview to prevent navigation to other pages
  const handlePreviewClickCapture = (e) => {
    // If the click is on or within the close button, let it through
    if (e.target.closest('.preview-close-btn')) {
      return;
    }

    // Check if the clicked element is an anchor link or button inside the preview
    const linkOrInteractive = e.target.closest('a, button');
    if (linkOrInteractive) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#ffffff',
        zIndex: 99999,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <style>{`
        /* Visual-only preview styles: prevent link cursor while preserving layout */
        .preview-visual-container a {
          cursor: default !important;
          -webkit-user-drag: none;
        }
        .preview-visual-container button:not(.preview-close-btn) {
          cursor: default !important;
        }
      `}</style>

      {/* Minimal Floating Close Button */}
      <button
        onClick={onClose}
        className="preview-close-btn"
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 100000,
          background: 'rgba(17, 17, 17, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '100px',
          padding: '10px 20px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          transition: 'transform 0.2s ease, background 0.2s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#000000';
          e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(17, 17, 17, 0.85)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Exit Preview (Esc)"
      >
        <X size={16} />
        <span>Close Preview</span>
      </button>

      {/* Visual-only Responsive Content Container */}
      <div 
        className="preview-visual-container"
        onClickCapture={handlePreviewClickCapture}
        style={{
          width: '100%',
          minHeight: '100vh',
          paddingTop: '20px',
          paddingBottom: '60px'
        }}
      >
        <HomePage previewItems={items} />
      </div>
    </div>
  );
};

export default HomepagePreviewModal;
