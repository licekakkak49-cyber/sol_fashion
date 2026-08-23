import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import styles from '../../../../components/CollectionHighlight.module.css';
import ProductCard from '../../../../components/ProductCard';
import { useAdmin } from '../../../../context/AdminContext';
import ImageCropper from '../../../../components/ImageCropper';
import ProductSelectionDrawer from './ProductSelectionDrawer';

const CollectionHighlightEditor = ({ module, updateData }) => {
  const { data } = module;
  const { products } = useAdmin();
  
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [activeImageKey, setActiveImageKey] = useState(null); // 'leftImage' or 'rightImage'
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setCropImageSrc(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const openImageCropper = (imageKey) => {
    setActiveImageKey(imageKey);
    fileInputRef.current?.click();
  };

  const openProductDrawer = (index) => {
    setActiveProductIndex(index);
    setIsDrawerOpen(true);
  };

  const handleProductSelect = (product) => {
    const newFeatured = [...(data.featuredProducts || [])];
    newFeatured[activeProductIndex] = product.id;
    updateData({ ...data, featuredProducts: newFeatured });
    setIsDrawerOpen(false);
  };

  const featuredProductIds = data.featuredProducts || [];
  const featuredProducts = featuredProductIds.map(id => products.find(p => p.id === id)).filter(Boolean);

  // Fill in blanks if fewer than 4 products
  while (featuredProducts.length < 4) {
    featuredProducts.push({ id: 'empty-' + featuredProducts.length, name: 'Click to select product', price: 0, image: '', isPlaceholder: true });
  }

  return (
    <>
      <section className={styles.section} style={{ position: 'relative' }}>
        <div className={styles.textContainer}>
          <h2 
            className={styles.title}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateData({ ...data, title: e.currentTarget.innerText })}
            style={{ outline: 'none', borderBottom: '1px dashed #ccc', minWidth: '200px' }}
          >
            {data.title}
          </h2>
          <span 
            className={styles.link}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateData({ ...data, linkText: e.currentTarget.innerText })}
            style={{ outline: 'none', borderBottom: '1px dashed #ccc', minWidth: '150px' }}
          >
            {data.linkText}
          </span>
        </div>
        
        <div className={styles.grid}>
          {['leftImage', 'rightImage'].map((key) => (
            <div 
              key={key} 
              className={styles.imageWrapper} 
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => openImageCropper(key)}
            >
              <img 
                src={data[key]} 
                alt={`${key} Editor`} 
                className={styles.image}
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
                <span style={{ fontSize: '18px', letterSpacing: '0.05em' }}>Change Image</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.productGrid}>
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className={styles.productCardWrapper} 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => openProductDrawer(index)}
            >
              {product.isPlaceholder ? (
                <div style={{ width: '100%', aspectRatio: '4/5', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Click to select product
                </div>
              ) : (
                <div style={{ pointerEvents: 'none' }}>
                  <ProductCard 
                    id={product.id}
                    image={product.image}
                    hoverImage={product.hoverImage}
                    name={product.name}
                    price={product.price}
                    tags={product.tags}
                    colors={product.colors}
                    selectedColor={product.selectedColor}
                    extraColorsCount={product.extraColorsCount}
                    isLarge={false}
                    overlayMode={true}
                  />
                </div>
              )}
              {/* Hover Overlay for Product Selection */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'white', opacity: 0, transition: 'opacity 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <div style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', fontSize: '14px' }}>
                  Select Product
                </div>
              </div>
            </div>
          ))}
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
            aspectRatio={4 / 5}
            showFocusBox={false}
            onCropComplete={(croppedBase64) => {
              updateData({ ...data, [activeImageKey]: croppedBase64 });
              setCropImageSrc(null);
            }}
            onCancel={() => setCropImageSrc(null)}
          />
        </div>
      )}

      {isDrawerOpen && (
        <ProductSelectionDrawer 
          onClose={() => setIsDrawerOpen(false)} 
          onSelect={handleProductSelect} 
        />
      )}
    </>
  );
};

export default CollectionHighlightEditor;
