import React from 'react';
import { Link } from 'react-router-dom';

const TextBlock = ({ data, isPreview }) => {
  const align = data?.alignment || 'left'; // 'left' or 'center'
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: align === 'left' ? 'flex-start' : 'center',
      padding: isPreview ? '0' : '72px 0px', 
      textAlign: align,
      width: '100%',
      backgroundColor: 'transparent'
    }}>
      {data?.title && (
        <h2 style={{ 
          fontSize: '28px', 
          margin: '0 0 16px 0', 
          fontWeight: 400, 
          fontFamily: 'var(--font-sans)',
          color: '#111'
        }}>
          {data.title}
        </h2>
      )}
      
      {data?.linkText && (
        <Link 
          to={data.linkUrl || '#'} 
          style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            color: '#111', 
            textDecoration: 'none',
            borderBottom: '1px solid #111',
            paddingBottom: '4px',
            fontWeight: 500
          }}
        >
          {data.linkText}
        </Link>
      )}
    </div>
  );
};

export default TextBlock;
