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
const highlightOptions = [{label: 'New', value: 'new'}];

export default function ProductEditorDrawer({ isOpen, onClose, onSave, initialData, categories, brands, config }) {
  const [formData, setFormData] = useState({
    name: '', subtitle: '', brandId: '', price: '', sku: '', stock: '', description: '',
    mainCategory: '', subCategory: '', size: '', fit: '', material: '', modelInfo: '', careInstructions: '',
    dimLength: '', dimHeight: '', dimWidth: '', strapDrop: '', hardware: '', heelHeight: '', highlight: [],
    coverImage: '', hoverImage: '', galleryImages: [], colorVariants: []
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

      // Auto-migrate legacy images into variants
      let variants = Array.isArray(initialData.colorVariants) ? initialData.colorVariants : [];
      if (variants.length === 0) {
        variants = [{
          id: Date.now(),
          name: 'Original',
          hex: '#000000',
          isMain: true,
          stock: {},
          images: [coverImg, hoverImg, ...gallImgs].filter(Boolean)
        }];
      } else {
        variants = variants.map(v => {
          if (!v.images && v.image) v.images = [v.image];
          if (!v.images) v.images = [];
          return v;
        });
      }

      setFormData({
        ...initialData,
        name: initialData.name || '',
        subtitle: initialData.subtitle || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
        mainCategory: initialData.mainCategory || (config?.defaultMainCategory || ''),
        subCategory: initialData.subCategory || (config?.defaultSubCategory || ''),
        highlight: Array.isArray(initialData.tags) ? initialData.tags : (Array.isArray(initialData.highlight) ? initialData.highlight : []),
        colorVariants: variants
      });
      setError('');
    }
  }, [isOpen, initialData, config]);

  
  const getAvailableSizes = () => {
    if (!formData.mainCategory) return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    if (formData.mainCategory === 'Ready to Wear' || formData.mainCategory === 'Clothing') {
      return ['XS', 'S', 'M', 'L', 'XL'];
    }
    if (formData.mainCategory === 'Accessories & Shoes' && formData.subCategory) {
      if (['Sandals', 'Heels', 'Flats', 'Shoes'].includes(formData.subCategory)) {
        return ['35', '36', '37', '38', '39', '40', '41', '42'];
      }
      return ['One Size']; 
    }
    if (formData.mainCategory === 'Bags') {
      return ['One Size'];
    }
    return ['One Size'];
  };

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
    const mainVariant = (formData.colorVariants || []).find(v => v.isMain) || (formData.colorVariants || [])[0];
    const hasCover = mainVariant && mainVariant.images && mainVariant.images.length > 0;
    if (!hasCover) return setError('⚠️ Cover Image for the Main Color is required.');

    setIsUploading(true);
    setError('');
    
    try {


      // Upload variant images
      const uploadedVariants = [];
      for (const variant of (formData.colorVariants || [])) {
        const uploadedImages = [];
        for (const img of (variant.images || [])) {
          if (img.startsWith('data:image')) {
            uploadedImages.push(await uploadImageToSupabase(img, 'variants'));
          } else {
            uploadedImages.push(img);
          }
        }
        uploadedVariants.push({ ...variant, images: uploadedImages });
      }

      // Extract main images for legacy compatibility
      let finalCoverUrl = '';
      let finalHoverUrl = '';
      let finalGalleryUrls = [];
      const mainVariant = uploadedVariants.find(v => v.isMain) || uploadedVariants[0];
      if (mainVariant && mainVariant.images && mainVariant.images.length > 0) {
        finalCoverUrl = mainVariant.images[0] || '';
        finalHoverUrl = mainVariant.images[1] || '';
        finalGalleryUrls = mainVariant.images.slice(2);
      }

      // Calculate total stock from variants
      let totalStock = 0;
      for (const v of uploadedVariants) {
        if (v.stock) {
          totalStock += Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
        }
      }

      // Construct final payload
      const payload = {
        ...formData,
        stock: totalStock,
        coverImage: finalCoverUrl,
        hoverImage: finalHoverUrl,
        galleryImages: finalGalleryUrls,
        colorVariants: uploadedVariants,
        status: totalStock > 0 ? 'In Stock' : 'Out of Stock',
        image: finalCoverUrl,
        images: [finalCoverUrl, finalHoverUrl, ...finalGalleryUrls].filter(Boolean), // For legacy support
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

          {/* Categories */}
          {/* Color Variants Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Color Variants</h3>
              <button 
                onClick={() => handleChange('colorVariants', [...(formData.colorVariants || []), { id: Date.now(), name: '', hex: '#000000', images: [], isMain: (formData.colorVariants || []).length === 0, stock: {} }])}
                style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '100px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Add Color
              </button>
            </div>
            
            {(formData.colorVariants || []).length === 0 ? null : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(formData.colorVariants || []).map((variant, idx) => (
                  <div key={variant.id || idx} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Variant #{idx + 1}</span>
                      <button 
                        onClick={() => handleChange('colorVariants', formData.colorVariants.filter((_, i) => i !== idx))}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={labelStyle}>Color Name</label>
                        <input type="text" value={variant.name} onChange={(e) => {
                          const newV = [...formData.colorVariants];
                          newV[idx].name = e.target.value;
                          handleChange('colorVariants', newV);
                        }} style={inputStyle} placeholder="e.g. Midnight Blue" />
                      </div>
                      <div>
                        <label style={labelStyle}>Hex Code</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input type="color" value={variant.hex} onChange={(e) => {
                            const newV = [...formData.colorVariants];
                            newV[idx].hex = e.target.value;
                            handleChange('colorVariants', newV);
                          }} style={{ width: '36px', height: '36px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                          <input type="text" value={variant.hex} onChange={(e) => {
                            const newV = [...formData.colorVariants];
                            newV[idx].hex = e.target.value;
                            handleChange('colorVariants', newV);
                          }} style={{ ...inputStyle, flex: 1 }} />
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ flex: '1 1 auto', minWidth: '320px' }}>
                        <label style={labelStyle}>Variant Images</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {(variant.images || []).map((img, imgIdx) => (
                            <div key={imgIdx} style={{ position: 'relative', width: '100px', height: '133px', borderRadius: '4px', overflow: 'hidden' }}>
                              <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Variant img" />
                              <button onClick={() => {
                                const newV = [...formData.colorVariants];
                                newV[idx].images = newV[idx].images.filter((_, i) => i !== imgIdx);
                                handleChange('colorVariants', newV);
                              }} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer' }}><X size={10} /></button>
                              {imgIdx === 0 && <span style={{position:'absolute', bottom: 0, left:0, width:'100%', background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:'11px', padding:'2px', textAlign:'center'}}>Cover</span>}
                              {imgIdx === 1 && <span style={{position:'absolute', bottom: 0, left:0, width:'100%', background:'rgba(0,0,0,0.6)', color:'#fff', fontSize:'11px', padding:'2px', textAlign:'center'}}>Hover</span>}
                            </div>
                          ))}
                          <label htmlFor={`variant-${idx}-upload`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100px', height: '133px', background: '#f9fafb', border: '1px dashed #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                            <UploadCloud size={16} color="#888" />
                          </label>
                          <input type="file" accept="image/*" id={`variant-${idx}-upload`} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, `variant-${idx}`)} />
                        </div>
                      </div>
                      
                      <div style={{ flex: '1 1 auto', minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <input 
                            type="radio" 
                            id={`main-${idx}`}
                            name="mainColor" 
                            checked={variant.isMain || false} 
                            onChange={() => {
                              const newV = [...formData.colorVariants].map((v, i) => ({...v, isMain: i === idx}));
                              handleChange('colorVariants', newV);
                            }}
                          />
                          <label htmlFor={`main-${idx}`} style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Set as Main Default Color</label>
                        </div>
                        
                        <label style={labelStyle}>Stock by Size</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {getAvailableSizes().map(size => (
                            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '60px' }}>
                              <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>{size}</span>
                              <input 
                                type="number" 
                                min="0" 
                                value={variant.stock?.[size] || 0} 
                                onChange={(e) => {
                                  const newV = [...formData.colorVariants];
                                  if (!newV[idx].stock) newV[idx].stock = {};
                                  newV[idx].stock[size] = parseInt(e.target.value) || 0;
                                  handleChange('colorVariants', newV);
                                }}
                                style={{ ...inputStyle, padding: '8px', textAlign: 'center' }} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              <div><label style={labelStyle}>Subtitle</label><input type="text" value={formData.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} style={inputStyle} placeholder="e.g. Ruched fitted dress" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Price (฿) *</label><input type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>SKU</label><input type="text" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} style={inputStyle} /></div>
              </div>
              
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
            if (cropState.target.startsWith('variant-')) {
              const vIndex = parseInt(cropState.target.split('-')[1], 10);
              const newVariants = [...(formData.colorVariants || [])];
              if (!newVariants[vIndex].images) newVariants[vIndex].images = [];
              newVariants[vIndex].images.push(croppedBase64);
              handleChange('colorVariants', newVariants);
            }
            setCropState({ src: null, target: null });
          }}
          onCancel={() => setCropState({ src: null, target: null })}
        />
      )}
    </>
  );
}
