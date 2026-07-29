import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import { getCroppedImg } from '../utils/cropImage';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 4 / 3, showFocusBox = true }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '90%', maxWidth: '800px', height: '60vh', background: '#222', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={setZoom}
          showGrid={true}
        />
        {/* Custom Crosshair Alignment Overlay */}
        {showFocusBox && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '1px', height: '100%', background: 'rgba(255,0,0,0.3)', position: 'absolute' }} />
            <div style={{ height: '1px', width: '100%', background: 'rgba(255,0,0,0.3)', position: 'absolute' }} />
            {/* Inner focus box for glasses */}
            <div style={{ width: '40%', height: '30%', border: '1px dashed rgba(255,255,255,0.4)', position: 'absolute' }} />
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <button onClick={onCancel} style={{ padding: '12px 24px', borderRadius: '100px', background: '#333', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
          <X size={16} /> Cancel
        </button>
        <button onClick={handleSave} style={{ padding: '12px 24px', borderRadius: '100px', background: '#fff', color: '#111', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
          <Check size={16} /> Crop & Save
        </button>
      </div>
      
      <div style={{ marginTop: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
        Drag to pan, scroll to zoom. Align the glasses in the center box.
      </div>
    </div>
  );
};

export default ImageCropper;
