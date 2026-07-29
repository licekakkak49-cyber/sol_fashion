import React, { useRef, useEffect, useState } from 'react';
import { Image as ImageIcon, EyeOff, UploadCloud, AlertTriangle } from 'lucide-react';
import styles from '../../pages/BespokeDetailPage.module.css';
import editorStyles from './BespokeEditor.module.css';
import ImageCropper from '../../components/ImageCropper';
import { useAdmin } from '../../context/AdminContext';

const ContentEditableText = ({ tag: Tag, className, value, onChange, placeholder, isVisible, toggleVisibility, style }) => {
  if (!isVisible && !onChange) return null;
  
  return (
    <div style={{ position: 'relative', width: '100%', opacity: isVisible ? 1 : 0.4 }}>
      <Tag
        className={`${className} ${editorStyles.editableText}`}
        contentEditable={!!onChange}
        suppressContentEditableWarning={true}
        onBlur={(e) => onChange && onChange(e.currentTarget.innerText)}
        data-placeholder={placeholder}
        style={{ minHeight: '1em', outline: 'none', ...style }}
      >
        {value}
      </Tag>
      {onChange && (
        <button 
          onClick={toggleVisibility}
          className={editorStyles.visibilityToggle}
          title={isVisible ? "Hide this element" : "Show this element"}
        >
          {isVisible ? 'Hide' : 'Hidden'}
        </button>
      )}
    </div>
  );
};

const ImageUploadBox = ({ imageSrc, onUploadRequest, className }) => {
  const fileInputRef = useRef(null);
  
  return (
    <div className={`${className} ${editorStyles.imageUploadBox}`} onClick={() => fileInputRef.current?.click()}>
      {imageSrc ? (
        <img src={imageSrc} className={className} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div className={editorStyles.imagePlaceholder}>
          <UploadCloud size={40} strokeWidth={1.5} style={{ marginBottom: '12px', color: '#9ca3af' }} />
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>Click or Drop image here</span>
          <span style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px', fontWeight: 500 }}>JPG, PNG up to 2MB</span>
        </div>
      )}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={(e) => {
          if(e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => onUploadRequest(ev.target.result);
            reader.readAsDataURL(e.target.files[0]);
          }
          e.target.value = null;
        }}
      />
    </div>
  );
};

const BespokeModuleEditor = ({ module, updateModule }) => {
  const { type, data } = module;
  const { products, brands } = useAdmin();
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [imageWarning, setImageWarning] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const updateData = (key, value) => {
    updateModule(module.id, { ...module, data: { ...module.data, [key]: value } });
  };

  const handleUploadRequest = (base64Str) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      if (img.width < 1000 || img.height < 600) {
        setImageWarning('⚠️ Warning: Image resolution is quite low. It may appear blurry after cropping.');
      } else {
        setImageWarning('');
      }
      setCropImageSrc(base64Str);
    };
  };

  const currentAspectRatio = type === 'full-image' ? 21 / 9 : 16 / 9;

  const renderTextContent = () => {
    const isCenterText = type === 'center-text';
    const isOnlyParagraph = isCenterText && !data.showHeading && data.showParagraph;

    const headingStyle = isCenterText ? { fontFamily: "'Inter', sans-serif", fontSize: '72px', fontWeight: 400, maxWidth: '1000px', margin: '0 auto', lineHeight: '0.9', letterSpacing: 'normal' } : {};
    const descriptionStyle = isCenterText ? { maxWidth: '800px', margin: isOnlyParagraph ? '0 auto' : '40px auto 0' } : {};

    return (
      <>
        <ContentEditableText 
          tag="h2" 
          className={styles.title} 
          value={data.heading} 
          onChange={(v) => updateData('heading', v)}
          placeholder="MAIN HEADING"
          isVisible={data.showHeading}
          toggleVisibility={() => updateData('showHeading', !data.showHeading)}
          style={headingStyle}
        />
        <div className={styles.description} style={descriptionStyle}>
          <ContentEditableText 
            tag="div" 
            className={styles.description} 
            value={data.paragraph} 
            onChange={(v) => updateData('paragraph', v)}
            placeholder="Enter paragraph text here (use enter for new lines)..."
            isVisible={data.showParagraph}
            toggleVisibility={() => updateData('showParagraph', !data.showParagraph)}
            style={{ width: '100%', maxWidth: 'none', margin: 0 }}
          />
        </div>
      </>
    );
  };

  return (
    <div className={editorStyles.moduleContainer}>
      <div className={editorStyles.moduleHeader}>
        <span className={editorStyles.moduleTypeBadge}>{type.replace('-', ' ').toUpperCase()}</span>
      </div>
      
      {/* Visual Editor Canvas */}
      <div className={editorStyles.canvas} style={{ padding: 0 }}>
        <div className={styles.pageContainer} style={{ padding: '40px 60px', minHeight: 'auto', background: '#f9fafb' }}>
          
          {type === 'split-left-image' && (
            <div className={`${styles.row} ${styles.rowNormal}`} style={{ margin: '40px 0', border: '1px dashed #d1d5db', background: '#fff', position: 'relative' }}>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <ImageUploadBox imageSrc={data.image} onUploadRequest={handleUploadRequest} className={styles.image} />
                </div>
              </div>
              <div className={styles.textColumn}>
                {renderTextContent()}
              </div>
            </div>
          )}

          {type === 'split-right-image' && (
            <div className={`${styles.row} ${styles.rowReverse}`} style={{ margin: '40px 0', border: '1px dashed #d1d5db', background: '#fff', position: 'relative' }}>
              <div className={styles.imageColumn}>
                <div className={styles.imageWrapper}>
                  <ImageUploadBox imageSrc={data.image} onUploadRequest={handleUploadRequest} className={styles.image} />
                </div>
              </div>
              <div className={styles.textColumn}>
                {renderTextContent()}
              </div>
            </div>
          )}

          {type === 'center-text' && (() => {
            const isOnlyParagraph = !data.showHeading && data.showParagraph;
            const containerMargin = isOnlyParagraph ? '60px 0' : '120px 0';
            
            return (
              <div className={styles.row} style={{ justifyContent: 'center', margin: containerMargin }}>
                <div className={styles.textColumn} style={{ width: '100%', alignItems: 'center', textAlign: 'center', paddingTop: 0 }}>
                  {renderTextContent()}
                </div>
              </div>
            );
          })()}

          {type === 'full-image' && (
            <div className={styles.moduleFullImage} style={{ border: '1px dashed #d1d5db', background: '#fff', position: 'relative', aspectRatio: '21 / 9' }}>
               <ImageUploadBox imageSrc={data.image} onUploadRequest={handleUploadRequest} />
            </div>
          )}

          {type === 'product-grid' && (() => {
            const searchResults = searchTerm 
              ? products?.filter(p => {
                  const brand = brands?.find(b => b.id === p.brandId);
                  const searchLower = searchTerm.toLowerCase();
                  return (brand?.name || '').toLowerCase().includes(searchLower) || 
                         (p.name || '').toLowerCase().includes(searchLower) ||
                         (p.model || '').toLowerCase().includes(searchLower);
                })
              : products || [];

            return (
              <div className={styles.relatedSection} style={{ marginTop: '40px', border: '1px dashed #d1d5db', background: '#fff', padding: '40px', position: 'relative' }}>
                <div style={{ marginBottom: '40px', position: 'relative' }}>
                  <input 
                    type="text"
                    placeholder="Search product by brand or model... (e.g. Gucci GG123)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', fontFamily: 'inherit' }}
                  />
                  {isSearchFocused && searchTerm && searchResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '300px', overflowY: 'auto', marginTop: '4px' }}>
                      {searchResults.map(p => {
                        const brand = brands?.find(b => b.id === p.brandId);
                        return (
                          <div 
                            key={p.id}
                            onClick={() => {
                              const newIds = [...(data.productIds || []), p.id];
                              updateData('productIds', newIds);
                              setSearchTerm('');
                              setIsSearchFocused(false);
                            }}
                            style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                          >
                            <img src={p.image} alt="preview" style={{ width: '80px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: '#f9fafb', padding: '2px' }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>
                                {brand?.name} <span style={{ color: '#000', fontWeight: 500 }}>{p.name || p.model}</span>
                              </div>
                              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                                {p.model ? `Model: ${p.model} | ` : ''}Frame: {p.frameColor || '-'} | Lens: {p.lensColor || '-'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {isSearchFocused && searchResults.length === 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', textAlign: 'center', color: '#6b7280', zIndex: 50, marginTop: '4px' }}>
                      No products found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              <div className={styles.showcaseGrid}>
                {(data.productIds || []).map((pid, idx) => {
                  const product = products?.find(p => p.id === pid);
                  if (!product) return null;
                  const brand = brands?.find(b => b.id === product.brandId);
                  return (
                    <div 
                      key={pid + '-' + idx} 
                      className={styles.showcaseItem} 
                      style={{ position: 'relative', cursor: 'grab', background: '#fff' }}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', idx);
                        e.currentTarget.style.opacity = '0.4';
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIdx = Number(e.dataTransfer.getData('text/plain'));
                        const toIdx = idx;
                        if (fromIdx !== toIdx) {
                          const newIds = [...data.productIds];
                          const [moved] = newIds.splice(fromIdx, 1);
                          newIds.splice(toIdx, 0, moved);
                          updateData('productIds', newIds);
                        }
                      }}
                    >
                      <button 
                        onClick={() => {
                          const newIds = [...data.productIds];
                          newIds.splice(idx, 1);
                          updateData('productIds', newIds);
                        }}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '2px' }}
                      >×</button>
                      <div className={styles.showcaseHeader}>
                        <span className={styles.showcaseBrand}>{brand?.name || 'Unknown'}</span>
                      </div>
                      <div className={styles.showcaseImageContainer} style={{ border: '1px solid #f3f4f6', borderRadius: '8px' }}>
                        <img src={product.image} alt={brand?.name} className={styles.showcaseImage} style={{ pointerEvents: 'none' }} />
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '12px', color: '#111', marginTop: '12px', fontWeight: 500 }}>{product.name || product.model}</div>
                      <div style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{product.frameColor} / {product.lensColor}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

          {type === 'chat-button' && (
            <div className={styles.chatBtnContainer} style={{ marginTop: '40px', padding: '40px', border: '1px dashed #d1d5db', background: '#fff' }}>
              <button className={styles.chatWithStylistBtn} style={{ pointerEvents: 'none' }}>
                <div className={styles.lineCircle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.967C23.156 14.375 24 12.459 24 10.314" />
                  </svg>
                </div>
                {data.text || 'CHAT WITH STYLIST'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {cropImageSrc && (
        <ImageCropper 
          imageSrc={cropImageSrc} 
          aspectRatio={currentAspectRatio}
          showFocusBox={false}
          onCropComplete={(croppedBase64) => {
            updateData('image', croppedBase64);
            setCropImageSrc(null);
            setImageWarning('');
          }}
          onCancel={() => {
            setCropImageSrc(null);
            setImageWarning('');
          }}
        />
      )}

      {imageWarning && !cropImageSrc && (
        <div style={{ marginTop: '12px', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', color: '#d97706', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={14} />
          {imageWarning}
        </div>
      )}
    </div>
  );
};

export default BespokeModuleEditor;
