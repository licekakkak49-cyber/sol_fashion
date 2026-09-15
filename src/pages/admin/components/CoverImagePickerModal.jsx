import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Upload, Check, RotateCcw, Video, Image as ImageIcon, Link as LinkIcon, Loader2, Play, Trash2 } from 'lucide-react';
import { uploadFileToSupabase, isVideoMedia } from '../../../utils/supabaseStorage';

const CoverImagePickerModal = ({
  isOpen,
  onClose,
  product = null,
  currentCover = null,
  onSaveCover,
  isLarge = false
}) => {
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'image' | 'video'
  const [selectedCover, setSelectedCover] = useState(currentCover || product?.image || '');
  const [pendingVideoFile, setPendingVideoFile] = useState(null);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Collect all available existing images for this product
  const existingImages = useMemo(() => {
    if (!product) return [];
    const imgs = new Set();
    
    if (product.image) imgs.add(product.image);
    if (product.coverImage) imgs.add(product.coverImage);
    if (product.hoverImage) imgs.add(product.hoverImage);
    
    if (Array.isArray(product.images)) {
      product.images.forEach(img => { if (img) imgs.add(img); });
    }
    if (Array.isArray(product.galleryImages)) {
      product.galleryImages.forEach(img => { if (img) imgs.add(img); });
    }
    if (Array.isArray(product.colorVariants)) {
      product.colorVariants.forEach(variant => {
        if (variant.image) imgs.add(variant.image);
        if (Array.isArray(variant.images)) {
          variant.images.forEach(img => { if (img) imgs.add(img); });
        }
      });
    }

    return Array.from(imgs);
  }, [product]);

  useEffect(() => {
    if (isOpen && product) {
      const initialCover = currentCover || product.image || product.coverImage || '';
      setSelectedCover(initialCover);
      setPendingVideoFile(null);
      setPendingImageFile(null);
      setUploadError('');

      if (isVideoMedia(initialCover)) {
        setActiveTab('video');
        if (initialCover.startsWith('http')) {
          setVideoUrlInput(initialCover);
        } else {
          setVideoUrlInput('');
        }
      } else if (currentCover && !existingImages.includes(currentCover)) {
        setActiveTab('image');
        setVideoUrlInput('');
      } else {
        setActiveTab('photos');
        setVideoUrlInput('');
      }
    }
  }, [isOpen, product, currentCover, existingImages]);

  // Handle Esc key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isUploading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isUploading]);

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const previewUrl = URL.createObjectURL(file);
    setPendingImageFile(file);
    setPendingVideoFile(null);
    setSelectedCover(previewUrl);
    e.target.value = null;
  };

  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setUploadError('Video file size must be under 100MB');
      return;
    }

    setUploadError('');
    const previewUrl = URL.createObjectURL(file);
    setPendingVideoFile(file);
    setPendingImageFile(null);
    setSelectedCover(previewUrl);
    setVideoUrlInput('');
    e.target.value = null;
  };

  const handleApplyVideoUrl = () => {
    const trimmed = videoUrlInput.trim();
    if (!trimmed) return;
    setPendingVideoFile(null);
    setPendingImageFile(null);
    setSelectedCover(trimmed);
    setUploadError('');
  };

  const handleSelectExistingPhoto = (img) => {
    setSelectedCover(img);
    setPendingVideoFile(null);
    setPendingImageFile(null);
    setUploadError('');
  };

  const handleResetToDefault = () => {
    const defaultImg = product?.image || product?.coverImage || '';
    setSelectedCover(defaultImg);
    setPendingVideoFile(null);
    setPendingImageFile(null);
    setVideoUrlInput('');
    setUploadError('');
    setActiveTab('photos');
  };

  const handleSave = async () => {
    setIsUploading(true);
    setUploadError('');

    try {
      let finalCover = selectedCover;

      if (pendingVideoFile) {
        finalCover = await uploadFileToSupabase(pendingVideoFile, 'product-covers');
      } else if (pendingImageFile) {
        finalCover = await uploadFileToSupabase(pendingImageFile, 'product-covers');
      }

      const defaultImg = product?.image || product?.coverImage || '';
      if (finalCover === defaultImg && !pendingImageFile && !pendingVideoFile) {
        onSaveCover(null);
      } else {
        onSaveCover(finalCover);
      }
      onClose();
    } catch (err) {
      console.error('Error saving cover:', err);
      setUploadError(err.message || 'Failed to upload media. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen || !product) return null;

  const defaultImg = product?.image || product?.coverImage || '';
  const isVideo = isVideoMedia(selectedCover) || Boolean(pendingVideoFile);
  const isUsingDefault = selectedCover === defaultImg && !pendingImageFile && !pendingVideoFile;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={isUploading ? undefined : onClose}
    >
      <style>{`
        @keyframes coverModalSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#111' }}>
                Slot Cover Media
              </h3>
              {isLarge && (
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
                  2x2 Large Slot
                </span>
              )}
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6b7280' }}>
              {product.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: 'none',
              background: '#f3f4f6',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4b5563'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* TABS HEADER */}
        <div style={{ padding: '14px 24px 0', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: activeTab === 'photos' ? '2px solid #111' : '2px solid transparent',
                fontSize: '13px',
                fontWeight: activeTab === 'photos' ? 600 : 500,
                cursor: 'pointer',
                background: activeTab === 'photos' ? '#f9fafb' : 'transparent',
                color: activeTab === 'photos' ? '#111' : '#6b7280',
                transition: 'all 0.15s ease'
              }}
            >
              <ImageIcon size={14} />
              <span>Product Photos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('image')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: activeTab === 'image' ? '2px solid #111' : '2px solid transparent',
                fontSize: '13px',
                fontWeight: activeTab === 'image' ? 600 : 500,
                cursor: 'pointer',
                background: activeTab === 'image' ? '#f9fafb' : 'transparent',
                color: activeTab === 'image' ? '#111' : '#6b7280',
                transition: 'all 0.15s ease'
              }}
            >
              <Upload size={14} />
              <span>Custom Image</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('video')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: activeTab === 'video' ? '2px solid #111' : '2px solid transparent',
                fontSize: '13px',
                fontWeight: activeTab === 'video' ? 600 : 500,
                cursor: 'pointer',
                background: activeTab === 'video' ? '#f9fafb' : 'transparent',
                color: activeTab === 'video' ? '#111' : '#6b7280',
                transition: 'all 0.15s ease'
              }}
            >
              <Video size={14} />
              <span>Video Cover</span>
              <span style={{ fontSize: '10px', background: activeTab === 'video' ? '#111' : '#e5e7eb', color: activeTab === 'video' ? '#fff' : '#4b5563', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                2x2
              </span>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* TAB 1: PRODUCT PHOTOS */}
          {activeTab === 'photos' && (
            <div>
              {existingImages.length === 0 ? (
                <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '8px', fontSize: '13px', color: '#888', textAlign: 'center' }}>
                  No photos available for this product
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                  {existingImages.map((img, idx) => {
                    const isSelected = selectedCover === img && !pendingImageFile && !pendingVideoFile;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectExistingPhoto(img)}
                        style={{
                          position: 'relative',
                          height: '120px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: isSelected ? '2.5px solid #111' : '1px solid #e5e7eb',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              background: '#111',
                              color: '#fff',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        {img === defaultImg && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '4px',
                              left: '4px',
                              background: 'rgba(0,0,0,0.75)',
                              color: '#fff',
                              fontSize: '9px',
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                          >
                            Default
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOM IMAGE */}
          {activeTab === 'image' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '1.5px dashed #d1d5db',
                  borderRadius: '12px',
                  padding: '28px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: pendingImageFile ? '#f0fdf4' : '#fafafa',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#111'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  style={{ display: 'none' }}
                />
                <Upload size={28} color={pendingImageFile ? '#16a34a' : '#6b7280'} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>
                  {pendingImageFile ? pendingImageFile.name : 'Upload custom image'}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                  {pendingImageFile ? `${(pendingImageFile.size / 1024).toFixed(1)} KB • Ready to save` : 'JPG, PNG, WEBP'}
                </div>
              </div>

              {selectedCover && !isVideo && (
                <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb', height: '180px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={selectedCover} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VIDEO COVER */}
          {activeTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>
                  Video Cover for 2x2 Large Card
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  Autoplays muted with minimal controls (Pause / Play and Sound toggle).
                </div>
              </div>

              {/* Video File Dropzone */}
              <div
                onClick={() => videoInputRef.current?.click()}
                style={{
                  border: '1.5px dashed #d1d5db',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: pendingVideoFile ? '#f0fdf4' : '#fafafa',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#111'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
              >
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                  onChange={handleVideoFileUpload}
                  style={{ display: 'none' }}
                />
                <Video size={28} color={pendingVideoFile ? '#16a34a' : '#6b7280'} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>
                  {pendingVideoFile ? pendingVideoFile.name : 'Choose video file'}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                  {pendingVideoFile ? `${(pendingVideoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload` : 'MP4, WebM, MOV up to 100MB'}
                </div>
              </div>

              {/* Direct URL input */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '6px' }}>
                  Or direct video URL
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <LinkIcon size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="url"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 34px',
                        fontSize: '13px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleApplyVideoUrl(); }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyVideoUrl}
                    disabled={!videoUrlInput.trim()}
                    style={{
                      padding: '9px 16px',
                      background: videoUrlInput.trim() ? '#111' : '#e5e7eb',
                      color: videoUrlInput.trim() ? '#fff' : '#9ca3af',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: videoUrlInput.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s'
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Live Video Preview Player */}
              {isVideo && (
                <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb', background: '#000' }}>
                  <div style={{ padding: '8px 12px', background: '#18181b', color: '#fff', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Play size={10} fill="#fff" /> Live Video Preview
                    </span>
                    <span style={{ color: '#a1a1aa' }}>Looping / Muted</span>
                  </div>
                  <div style={{ position: 'relative', width: '100%', height: '200px', background: '#000' }}>
                    <video
                      key={selectedCover}
                      src={selectedCover}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Selection Bar */}
          {selectedCover && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f0f0f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#000', position: 'relative' }}>
                {isVideo ? (
                  <video src={selectedCover} muted autoPlay loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={selectedCover} alt="Selected cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isVideo ? (
                    <>
                      <Video size={13} />
                      <span>Video Cover Active</span>
                    </>
                  ) : isUsingDefault ? (
                    'Default Product Photo'
                  ) : pendingImageFile ? (
                    'Custom Image (Pending Upload)'
                  ) : (
                    'Product Photo Selected'
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                  {isVideo 
                    ? (pendingVideoFile ? `${pendingVideoFile.name} • Ready to upload` : 'Direct video stream link')
                    : (isUsingDefault ? 'Standard product image' : 'Cover image')}
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {uploadError && (
            <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '12px' }}>
              {uploadError}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa'
          }}
        >
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isUsingDefault || isUploading}
            style={{
              padding: '8px 14px',
              background: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: (isUsingDefault || isUploading) ? 'not-allowed' : 'pointer',
              color: (isUsingDefault || isUploading) ? '#9ca3af' : '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              style={{
                padding: '8px 16px',
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: isUploading ? 'not-allowed' : 'pointer',
                color: '#374151'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading}
              style={{
                padding: '8px 22px',
                background: isUploading ? '#6b7280' : '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isUploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={14} style={{ animation: 'coverModalSpin 1s linear infinite' }} />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoverImagePickerModal;
