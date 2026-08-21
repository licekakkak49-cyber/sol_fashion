import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import { getCroppedImg } from '../utils/cropImage';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 4 / 3, showFocusBox = true, warningMessage = '', allowAspectChange = false }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [currentAspect, setCurrentAspect] = useState(aspectRatio);
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
          aspect={currentAspect}
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
      
      
      {allowAspectChange && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', background: '#333', padding: '8px', borderRadius: '100px' }}>
          {[
            { label: '3:4', value: 3/4 },
            { label: '1:1', value: 1 },
            { label: '4:3', value: 4/3 },
            { label: '16:9', value: 16/9 },
          ].map(opt => (
            <button 
              key={opt.label}
              onClick={() => setCurrentAspect(opt.value)}
              style={{
                padding: '6px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                background: currentAspect === opt.value ? '#fff' : 'transparent',
                color: currentAspect === opt.value ? '#111' : '#fff'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <button onClick={onCancel} style={{ padding: '12px 24px', borderRadius: '100px', background: '#333', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
          <X size={16} /> Cancel
        </button>
        <button onClick={handleSave} style={{ padding: '12px 24px', borderRadius: '100px', background: '#fff', color: '#111', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
          <Check size={16} /> Crop & Save
        </button>
      </div>
      
      {warningMessage && (
        <div style={{ marginTop: '16px', color: '#fca5a5', fontSize: '14px', fontWeight: 500, background: 'rgba(220,38,38,0.2)', padding: '8px 16px', borderRadius: '8px' }}>
          {warningMessage}
        </div>
      )}
      <div style={{ marginTop: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
        Drag to pan, scroll to zoom.
      </div>
    </div>
  );
};

export default ImageCropper;
