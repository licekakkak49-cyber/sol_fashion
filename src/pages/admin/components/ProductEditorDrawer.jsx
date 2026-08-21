import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Check, Plus, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import ImageCropper from '../../../components/ImageCropper';
import { uploadImageToSupabase } from '../../../utils/supabaseStorage';

// --- Reusable Components (Copied from ManageProductsPage) ---
const DropdownSelector = ({ label, options, selectedValue, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <select
      value={selectedValue || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', background: '#f9fafb', color: selectedValue ? '#111' : '#888', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
    >
      <option value="" disabled>Select {label}</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const MultiPillSelector = ({ label, options, selectedValues = [], onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map(opt => {
        const isSelected = selectedValues.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              if (isSelected) onChange(selectedValues.filter(v => v !== opt.value));
              else onChange([...selectedValues, opt.value]);
            }}
            style={{ padding: '8px 16px', borderRadius: '100px', border: isSelected ? '1px solid #111' : '1px solid #e5e7eb', background: isSelected ? '#111' : '#fff', color: isSelected ? '#fff' : '#666', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

// --- Options Constants ---
const rtwSizes = ['XS', 'S', 'M', 'L', 'XL'].map(c => ({ label: c, value: c }));
const rtwFits = ['Oversized', 'Slim Fit', 'Relaxed', 'Cropped'].map(c => ({ label: c, value: c }));
const bagHardware = ['Gold-tone', 'Silver-tone', 'Matte Black'].map(c => ({ label: c, value: c }));
const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42'].map(c => ({ label: c, value: c }));
const heelHeights = ['Flat', '55mm', '85mm', '100mm'].map(c => ({ label: c, value: c }));
const accSizes = ['One Size', 'S', 'M', 'L'].map(c => ({ label: c, value: c }));
const materials = ['Cotton', 'Silk', 'Leather', 'Calfskin', 'Suede', 'Canvas', 'Nylon'].map(c => ({ label: c, value: c }));
const highlightOptions = [{label: 'New Arrival', value: 'New Arrival'}, {label: 'Best Seller', value: 'Best Seller'}];

export default function ProductEditorDrawer({ isOpen, onClose, onSave, initialData, categories, brands, config }) {
  const [formData, setFormData] = useState({
    name: '', brandId: '', price: '', sku: '', stock: '', description: '',
    mainCategory: '', subCategory: '', size: '', fit: '', material: '', modelInfo: '', careInstructions: '',
    dimLength: '', dimHeight: '', dimWidth: '', strapDrop: '', hardware: '', heelHeight: '', highlight: [],
    coverImage: '', hoverImage: '', galleryImages: []
  });

  const [cropState, setCropState] = useState({ src: null, target: null }); // target: 'cover' | 'hover'
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRefCover = useRef(null);
  const fileInputRefHover = useRef(null);
  const fileInputRefGallery = useRef(null);

  useEffect(() => {
    if (isOpen && initialData) {
      // Setup formData mapping from product format to internal state
      let coverImg = initialData.coverImage || initialData.image || '';
      let hoverImg = initialData.hoverImage || '';
      let gallImgs = initialData.galleryImages || initialData.images || [];
      
      // Cleanup legacy logic where cover was in images array
      if (gallImgs.includes(coverImg)) {
        gallImgs = gallImgs.filter(img => img !== coverImg);
      }

      setFormData({
        ...initialData,
        name: initialData.name || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        mainCategory: initialData.mainCategory || (config?.defaultMainCategory || ''),
        subCategory: initialData.subCategory || (config?.defaultSubCategory || ''),
        highlight: Array.isArray(initialData.highlight) ? initialData.highlight : [],
        coverImage: coverImg,
        hoverImage: hoverImg,
        galleryImages: gallImgs
      });
      setError('');
    }
  }, [isOpen, initialData, config]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFileChange = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropState({ src: reader.result, target });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return setError('⚠️ Product Name is required.');
    if (!formData.price) return setError('⚠️ Price is required.');
    if (!formData.mainCategory) return setError('⚠️ Main Category is required.');
    if (!formData.coverImage) return setError('⚠️ Cover Image (3:4) is required.');

    setIsUploading(true);
    setError('');
    
    try {
      const coverUrl = await uploadImageToSupabase(formData.coverImage, 'covers');
      const hoverUrl = formData.hoverImage ? await uploadImageToSupabase(formData.hoverImage, 'hovers') : '';
      
      const galleryUrls = [];
      for (const img of formData.galleryImages) {
        galleryUrls.push(await uploadImageToSupabase(img, 'gallery'));
      }

      // Construct final payload
      const payload = {
        ...formData,
        coverImage: coverUrl,
        hoverImage: hoverUrl,
        galleryImages: galleryUrls,
        status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
        image: coverUrl,
        images: [coverUrl, ...galleryUrls], // For legacy support
        id: initialData?.id
      };

      await onSave(payload, config);
      onClose();
    } catch (err) {
      console.error(err);
      setError('⚠️ Failed to upload images to Supabase. Make sure you have set up the project correctly.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', background: '#f9fafb', color: '#111', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const uploadBoxStyle = { position: 'relative', background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100 }} onClick={onClose} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '600px', background: '#fff', zIndex: 101, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', transform: 'translateX(0)', transition: 'transform 0.3s ease-in-out' }}>
        
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{initialData?.isPlaceholder ? 'Add Product to Grid' : (initialData?.id ? 'Edit Product' : 'Add New Product')}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {error && <div style={{ padding: '12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', color: '#d97706', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} />{error}</div>}

          {/* Images Section */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Images</h3>
            
            {/* Card Images (3:4) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Cover Image (3:4) *</label>
                <div style={{ ...uploadBoxStyle, aspectRatio: '3/4', border: formData.coverImage ? 'none' : '1px dashed #ccc' }} onClick={() => fileInputRefCover.current.click()}>
                  {formData.coverImage ? <img src={formData.coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cover" /> : <div style={{ textAlign: 'center', color: '#999' }}><Plus size={24} /><div style={{ fontSize: '11px', marginTop: '4px' }}>Upload Cover</div></div>}
                  <input type="file" ref={fileInputRefCover} accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} style={{ display: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Hover Packshot (3:4)</label>
                <div style={{ ...uploadBoxStyle, aspectRatio: '3/4', border: formData.hoverImage ? 'none' : '1px dashed #ccc' }} onClick={() => fileInputRefHover.current.click()}>
                  {formData.hoverImage ? <img src={formData.hoverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Hover" /> : <div style={{ textAlign: 'center', color: '#999' }}><Plus size={24} /><div style={{ fontSize: '11px', marginTop: '4px' }}>Upload Hover</div></div>}
                  <input type="file" ref={fileInputRefHover} accept="image/*" onChange={(e) => handleFileChange(e, 'hover')} style={{ display: 'none' }} />
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label style={labelStyle}>Gallery Images (Any Size)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {formData.galleryImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => handleChange('galleryImages', formData.galleryImages.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}><X size={12} /></button>
                  </div>
                ))}
                <div style={{ ...uploadBoxStyle, aspectRatio: '1' }} onClick={() => fileInputRefGallery.current.click()}>
                  <Plus size={20} color="#999" />
                  <input type="file" ref={fileInputRefGallery} accept="image/*" onChange={(e) => handleFileChange(e, 'gallery')} style={{ display: 'none' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Categorization</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <DropdownSelector label="Main Category" options={Object.keys(categories).map(c => ({ label: c, value: c }))} selectedValue={formData.mainCategory} onChange={(val) => { handleChange('mainCategory', val); handleChange('subCategory', ''); }} />
              {formData.mainCategory && categories[formData.mainCategory] && (
                <DropdownSelector label="Sub Category" options={categories[formData.mainCategory].map(c => ({ label: c, value: c }))} selectedValue={formData.subCategory} onChange={(val) => handleChange('subCategory', val)} />
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Basic Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={labelStyle}>Product Name *</label><input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} placeholder="e.g. Silk Blouse" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Price (฿) *</label><input type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>SKU</label><input type="text" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Stock Quantity</label><input type="number" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Description</label><textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} style={{ ...inputStyle, minHeight: '80px' }} /></div>
            </div>
          </div>

          {/* Dynamic Attributes */}
          {formData.mainCategory && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {formData.mainCategory === 'Ready-to-Wear' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <DropdownSelector label="Size" options={rtwSizes} selectedValue={formData.size} onChange={(val) => handleChange('size', val)} />
                      <DropdownSelector label="Fit" options={rtwFits} selectedValue={formData.fit} onChange={(val) => handleChange('fit', val)} />
                      <DropdownSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div><label style={labelStyle}>Model Info</label><input type="text" value={formData.modelInfo} onChange={(e) => handleChange('modelInfo', e.target.value)} style={inputStyle} /></div>
                      <div><label style={labelStyle}>Care Instructions</label><input type="text" value={formData.careInstructions} onChange={(e) => handleChange('careInstructions', e.target.value)} style={inputStyle} /></div>
                    </div>
                  </>
                )}

                {formData.mainCategory === 'Bags' && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <div><label style={labelStyle}>Length (cm)</label><input type="number" value={formData.dimLength} onChange={(e) => handleChange('dimLength', e.target.value)} style={inputStyle} /></div>
                      <div><label style={labelStyle}>Height (cm)</label><input type="number" value={formData.dimHeight} onChange={(e) => handleChange('dimHeight', e.target.value)} style={inputStyle} /></div>
                      <div><label style={labelStyle}>Width (cm)</label><input type="number" value={formData.dimWidth} onChange={(e) => handleChange('dimWidth', e.target.value)} style={inputStyle} /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div><label style={labelStyle}>Strap Drop (cm)</label><input type="number" value={formData.strapDrop} onChange={(e) => handleChange('strapDrop', e.target.value)} style={inputStyle} /></div>
                      <DropdownSelector label="Hardware" options={bagHardware} selectedValue={formData.hardware} onChange={(val) => handleChange('hardware', val)} />
                      <DropdownSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                    </div>
                  </>
                )}

                {formData.mainCategory === 'Shoes' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <DropdownSelector label="EU Size" options={shoeSizes} selectedValue={formData.size} onChange={(val) => handleChange('size', val)} />
                    <DropdownSelector label="Heel Height" options={heelHeights} selectedValue={formData.heelHeight} onChange={(val) => handleChange('heelHeight', val)} />
                    <DropdownSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                  </div>
                )}
                
                {formData.mainCategory === 'Accessories' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <DropdownSelector label="Size" options={accSizes} selectedValue={formData.size} onChange={(val) => handleChange('size', val)} />
                    <DropdownSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                  </div>
                )}
                
                <MultiPillSelector label="Collection Highlight" options={highlightOptions} selectedValues={formData.highlight} onChange={(val) => handleChange('highlight', val)} />
              </div>
            </div>
          )}

          <div style={{ height: '40px' }} />
        </div>

        {/* Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#fff' }}>
          <button onClick={onClose} style={{ padding: '12px 24px', borderRadius: '100px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSave} disabled={isUploading} style={{ padding: '12px 32px', borderRadius: '100px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>{isUploading ? 'Saving...' : 'Save Product'}</button>
        </div>
      </div>

      {cropState.src && (
        <ImageCropper 
          imageSrc={cropState.src} 
          aspectRatio={3/4}
          allowAspectChange={cropState.target === 'gallery'}
          showFocusBox={false}
          onCropComplete={(croppedBase64) => {
            if (cropState.target === 'cover') handleChange('coverImage', croppedBase64);
            if (cropState.target === 'hover') handleChange('hoverImage', croppedBase64);
            if (cropState.target === 'gallery') handleChange('galleryImages', [...formData.galleryImages, croppedBase64]);
            setCropState({ src: null, target: null });
          }}
          onCancel={() => setCropState({ src: null, target: null })}
        />
      )}
    </>
  );
}
