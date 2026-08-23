import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import ImageCropper from '../../../../components/ImageCropper';

const ImageBlockEditor = ({ module, updateData }) => {
  const { data } = module;
  const fileInputRef = useRef(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setCropImageSrc(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      <div 
        style={{ cursor: 'pointer', position: 'relative', height: '100%', display: 'flex' }} 
        onClick={() => fileInputRef.current?.click()}
      >
        <img 
          src={data.imageUrl} 
          alt="Highlight" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', opacity: 0, transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
        >
          <Camera size={48} strokeWidth={1} style={{ marginBottom: '8px' }} />
          <span style={{ fontSize: '18px', letterSpacing: '0.05em' }}>Change Image</span>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      {cropImageSrc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}>
          <ImageCropper 
            imageSrc={cropImageSrc} aspectRatio={4 / 5} showFocusBox={false}
            onCropComplete={(c) => { updateData({ ...data, imageUrl: c }); setCropImageSrc(null); }}
            onCancel={() => setCropImageSrc(null)}
          />
        </div>
      )}
    </>
  );
};

export default ImageBlockEditor;
