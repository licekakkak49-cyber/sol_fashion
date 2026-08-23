import React from 'react';

const SpacerBlock = ({ data }) => {
  return (
    <div style={{ 
      minHeight: data?.height || '144px', 
      width: '100%',
    }} />
  );
};

export default SpacerBlock;
