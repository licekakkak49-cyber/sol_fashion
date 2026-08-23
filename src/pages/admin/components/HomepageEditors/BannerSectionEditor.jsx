import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import styles from '../../../../components/BannerSection.module.css';
import ImageCropper from '../../../../components/ImageCropper';

const BannerSectionEditor = ({ module, updateData }) => {
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
      <section 
        className={styles.banner} 
        style={{ cursor: 'pointer', position: 'relative', aspectRatio: '21/9', height: 'auto' }} 
        onClick={() => fileInputRef.current?.click()}
        title="Click to change Banner Image"
      >
        <img 
          src={data.imageUrl} 
          alt={data.altText || "Banner"} 
          className={styles.image} 
          style={{ objectPosition: data.objectPosition || 'center', height: '100%' }} 
        />
        
        {/* Hover Overlay */}
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
          <span style={{ fontSize: '18px', letterSpacing: '0.05em' }}>Change Banner Image</span>
        </div>

        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
      </section>

      {cropImageSrc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}>
          <ImageCropper 
            imageSrc={cropImageSrc} 
            aspectRatio={21 / 9}
            showFocusBox={false}
            onCropComplete={(croppedBase64) => {
              updateData({ ...data, imageUrl: croppedBase64 });
              setCropImageSrc(null);
            }}
            onCancel={() => setCropImageSrc(null)}
          />
        </div>
      )}
    </>
  );
};

export default BannerSectionEditor;
