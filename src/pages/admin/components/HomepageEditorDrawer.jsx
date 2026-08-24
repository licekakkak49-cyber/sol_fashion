import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Link, Layout, AlignLeft, AlignCenter } from 'lucide-react';
import ImageCropper from '../../../components/ImageCropper';
import { uploadImageToSupabase } from '../../../utils/supabaseStorage';

export default function HomepageEditorDrawer({ isOpen, onClose, onSave, initialData }) {
  const isTextModule = initialData?.layoutSize === '4x1';
  
  const [formData, setFormData] = useState({
    contentType: 'image',
    contentData: {}
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [cropState, setCropState] = useState({ src: null });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      let type = initialData.contentType;
      if (!type || type === 'placeholder') {
         type = initialData.layoutSize === '4x1' ? 'text' : 'image';
      }
      setFormData({
        contentType: type,
        contentData: initialData.contentData || {}
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contentData: {
        ...prev.contentData,
        [field]: value
      }
    }));
  };

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setCropState({ src: reader.result });
      reader.readAsDataURL(e.target.files[0]);
    }
    e.target.value = null; // reset
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let finalData = { ...formData };
      console.log("Saving formData from drawer:", finalData);
      
      // If image is a local base64 string, upload to Supabase
      if (!isTextModule && finalData.contentData.imageUrl?.startsWith('data:image')) {
        console.log("Uploading base64 image to Supabase...");
        const url = await uploadImageToSupabase(finalData.contentData.imageUrl, 'homepage');
        console.log("Upload successful, url:", url);
        finalData.contentData.imageUrl = url;
      }
      
      console.log("Calling onSave with:", finalData);
      onSave(finalData);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const expectedRatio = initialData?.layoutSize === '4x2' ? 3/2 : 3/4;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100 }} onClick={onClose} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '500px', background: '#fff', zIndex: 101, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', transform: 'translateX(0)', transition: 'transform 0.3s ease-in-out' }}>
        
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            {isTextModule ? 'Edit Text Module' : `Edit Image Block (${initialData?.layoutSize})`}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <form id="homepage-editor-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {initialData?.layoutSize !== '4x1' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Block Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <TypeOption 
                    active={formData.contentType === 'image'} 
                    onClick={() => setFormData(p => ({ ...p, contentType: 'image' }))}
                    icon={<Layout size={18}/>} label="Image/Banner" 
                  />
                  <TypeOption 
                    active={formData.contentType === 'product'} 
                    onClick={() => setFormData(p => ({ ...p, contentType: 'product' }))}
                    icon={<Layout size={18}/>} label="Product" 
                  />
                </div>
              </div>
            )}

            {isTextModule ? (
              <>
                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Alignment</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                    <TypeOption 
                      active={(formData.contentData.alignment || 'left') === 'left'} 
                      onClick={() => handleDataChange('alignment', 'left')}
                      icon={<AlignLeft size={18}/>} label="Align Left" 
                    />
                    <TypeOption 
                      active={(formData.contentData.alignment || 'left') === 'center'} 
                      onClick={() => handleDataChange('alignment', 'center')}
                      icon={<AlignCenter size={18}/>} label="Align Center" 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Heading</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={formData.contentData.title || ''} 
                    onChange={e => handleDataChange('title', e.target.value)}
                    placeholder="SOL Fall 2026"
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Link Text</label>
                  <input 
                    type="text"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={formData.contentData.linkText || ''} 
                    onChange={e => handleDataChange('linkText', e.target.value)}
                    placeholder="DISCOVER THE COLLECTION"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <Link size={14} /> Link URL
                  </label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={formData.contentData.linkUrl || ''} 
                    onChange={e => handleDataChange('linkUrl', e.target.value)}
                    placeholder="/collections/fall-2026"
                  />
                </div>
              </>
            ) : formData.contentType === 'product' ? (
              <div>
                <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Product ID</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                  value={formData.contentData.productId || ''} 
                  onChange={e => handleDataChange('productId', e.target.value)}
                  placeholder="Paste Product ID here..."
                />
              </div>
            ) : (
              <>
                {initialData?.layoutSize === '4x2' && (
                  <div>
                    <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Banner Layout Mode</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <TypeOption 
                        active={(formData.contentData.displayMode || 'normal') === 'normal'} 
                        onClick={() => handleDataChange('displayMode', 'normal')}
                        icon={<Layout size={18}/>} label="Normal" 
                      />
                      <TypeOption 
                        active={formData.contentData.displayMode === 'edge-to-edge'} 
                        onClick={() => handleDataChange('displayMode', 'edge-to-edge')}
                        icon={<Layout size={18}/>} label="Touch Edges" 
                      />
                      <TypeOption 
                        active={formData.contentData.displayMode === 'full-width'} 
                        onClick={() => handleDataChange('displayMode', 'full-width')}
                        icon={<Layout size={18}/>} label="Full Screen" 
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Image (Required)</label>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageFileChange}
                  />
                  
                  {!formData.contentData.imageUrl ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ width: '100%', aspectRatio: expectedRatio, border: '2px dashed #e5e7eb', borderRadius: '12px', background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '12px', transition: 'border 0.2s', overflow: 'hidden' }}
                    >
                      <UploadCloud size={32} color="#888" />
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#111', fontWeight: 600, display: 'block' }}>Upload Image</span>
                        <span style={{ fontSize: '12px', color: '#888' }}>Cropped to {expectedRatio === 3/2 ? '3:2 (Landscape)' : '3:4 (Portrait)'}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eaeaea' }}>
                      <img src={formData.contentData.imageUrl} alt="Preview" style={{ width: '100%', aspectRatio: expectedRatio, objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'opacity 0.2s' }} 
                           onMouseEnter={e => e.currentTarget.style.opacity = 1} 
                           onMouseLeave={e => e.currentTarget.style.opacity = 0}
                           onClick={() => fileInputRef.current?.click()}>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><UploadCloud size={18}/> Replace Image</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <Link size={14} /> Action Link (Optional)
                  </label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', background: '#f9fafb', outline: 'none' }}
                    value={formData.contentData.linkUrl || ''} 
                    onChange={e => handleDataChange('linkUrl', e.target.value)}
                    placeholder="/collections/new-arrivals"
                  />
                </div>
              </>
            )}

</form>

        </div>

        {/* Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#fff' }}>
          <button type="button" onClick={onClose} disabled={isUploading} style={{ padding: '12px 24px', borderRadius: '100px', border: '1px solid #ddd', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="submit" form="homepage-editor-form" disabled={isUploading} style={{ padding: '12px 24px', borderRadius: '100px', border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            {isUploading ? 'Saving...' : 'Save Block'}
          </button>
        </div>
      </div>

      {cropState.src && !isTextModule && (
        <ImageCropper 
          imageSrc={cropState.src} 
          aspectRatio={expectedRatio}
          allowAspectChange={false}
          showFocusBox={false}
          onCropComplete={(croppedBase64) => {
            handleDataChange('imageUrl', croppedBase64);
            setCropState({ src: null });
          }}
          onCancel={() => setCropState({ src: null })}
        />
      )}
    </>
  );
}

const TypeOption = ({ active, onClick, icon, label }) => (
  <button 
    type="button"
    onClick={onClick}
    style={{
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      background: active ? '#111' : '#f9fafb',
      color: active ? '#fff' : '#444',
      border: active ? '1px solid #111' : '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer'
    }}
  >
    {icon}
    <span style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>
  </button>
);
