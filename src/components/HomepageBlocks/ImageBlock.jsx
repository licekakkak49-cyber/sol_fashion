import React from 'react';
import { Link } from 'react-router-dom';

const ImageBlock = ({ data }) => {
  const imageUrl = data?.imageUrl;
  const linkUrl = data?.linkUrl;
  
  if (!imageUrl) return null;

  const content = (
    <img 
      src={imageUrl} 
      alt="Block" 
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
    />
  );
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex' }}>
      {linkUrl ? (
        <Link to={linkUrl} style={{ width: '100%', height: '100%', display: 'block' }}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
};

export default ImageBlock;
