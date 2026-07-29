import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, X, UploadCloud, Search, Filter, Package, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import styles from './AdminLayout.module.css';
import ImageCropper from '../../components/ImageCropper';

// Pill Selector for Light Mode
const PillSelector = ({ label, options, selectedValue, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            border: selectedValue === opt.value ? '1px solid #111' : '1px solid #e5e7eb',
            background: selectedValue === opt.value ? '#111' : '#fff',
            color: selectedValue === opt.value ? '#fff' : '#666',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const MultiPillSelector = ({ label, options, selectedValues, onChange }) => (
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
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: isSelected ? '1px solid #111' : '1px solid #e5e7eb',
              background: isSelected ? '#111' : '#fff',
              color: isSelected ? '#fff' : '#666',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

const ManageProductsPage = () => {
  const { products, brands, addProduct, updateProduct, deleteProduct } = useAdmin();
  
  // Filtering and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'In Stock', 'Out of Stock'
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterHighlight, setFilterHighlight] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [imageWarning, setImageWarning] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    price: '',
    sku: '',
    stock: '',
    description: '',
    sizeLens: '',
    sizeBridge: '',
    sizeTemple: '',
    gender: 'Unisex',
    isPolarized: 'No',
    frameColor: 'Black',
    lensColor: 'Clear',
    material: 'Acetate',
    shape: 'Square',
    highlight: [],
    images: [],
    primaryImageIndex: 0
  });

  const getBrandName = (brandId) => {
    const brand = (brands || []).find(b => b?.slug === brandId || b?.id === brandId);
    return brand ? brand.name : brandId;
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name.trim()) {
      setFormError('⚠️ Product Name is required.');
      return;
    }
    if (!formData.brandId) {
      setFormError('⚠️ Please select a Brand.');
      return;
    }
    if (!formData.price) {
      setFormError('⚠️ Price is required.');
      return;
    }
    
    const finalImages = formData.images.length > 0 ? formData.images : (editingId && formData.image ? [formData.image] : ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000"]);
    
    const payload = {
      ...formData,
      status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
      images: finalImages,
      image: finalImages[formData.primaryImageIndex] || finalImages[0]
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', brandId: '', price: '', sku: '', stock: '', description: '',
      sizeLens: '', sizeBridge: '', sizeTemple: '', gender: 'Unisex', isPolarized: 'No',
      frameColor: 'Black', lensColor: 'Clear', material: 'Acetate', shape: 'Square', highlight: [], 
      images: [], primaryImageIndex: 0
    });
    setIsAdding(false);
    setEditingId(null);
    setFormError('');
  };

  const handleEdit = (product) => {
    // Ensure highlight is an array for old data compatibility
    const safeHighlight = Array.isArray(product.highlight) 
      ? product.highlight 
      : (product.highlight && product.highlight !== 'None' ? [product.highlight] : []);
      
    // Reconstruct images array if not present but image exists
    const safeImages = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : []);
      
    // Find primary index if it matches the main image, otherwise default to 0
    let primaryIdx = safeImages.findIndex(img => img === product.image);
    if (primaryIdx === -1) primaryIdx = 0;

    setFormData({
      ...product,
      highlight: safeHighlight,
      images: safeImages,
      primaryImageIndex: primaryIdx
    });
    setEditingId(product.id);
    setIsAdding(true);
    setFormError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          if (img.width < 800 || img.height < 800) {
            setImageWarning('⚠️ Warning: Image resolution is below 800x800px. It may appear blurry after cropping.');
          } else {
            setImageWarning('');
          }
          setCropImageSrc(reader.result);
        };
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null; // Reset so the same file can be clicked again
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products.filter(p => {
      if (!p) return false; // Guard against null/undefined product entries

      // 1. Tab Filter
      const stockNum = parseInt(p.stock) || 0;
      if (activeTab === 'In Stock' && stockNum === 0) return false;
      if (activeTab === 'Low Stock' && (stockNum === 0 || stockNum > 5)) return false;
      if (activeTab === 'Out of Stock' && stockNum > 0) return false;
      
      // 2. Dropdown Filters
      if (filterBrand !== 'All' && p.brandId !== filterBrand) return false;
      
      // Fallback gender to Unisex if missing for older mock data
      const pGender = p.gender || 'Unisex';
      if (filterGender !== 'All' && pGender !== filterGender) return false;
      
      const pHighlight = Array.isArray(p.highlight) ? p.highlight : (p.highlight && p.highlight !== 'None' ? [p.highlight] : []);
      if (filterHighlight !== 'All' && !pHighlight.includes(filterHighlight)) return false;
      
      // 3. Search Query
      if (searchQuery) {
        const query = String(searchQuery || '').toLowerCase();
        const safeName = String(p.name || '');
        const safeSku = String(p.sku || '');
        
        const matchName = safeName.toLowerCase().includes(query);
        const matchSku = safeSku.toLowerCase().includes(query);
        if (!matchName && !matchSku) return false;
      }
      
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0);
      } else if (sortBy === 'Oldest') {
        return new Date(a.uploadDate || 0) - new Date(b.uploadDate || 0);
      } else if (sortBy === 'Name A-Z') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'Name Z-A') {
        return (b.name || '').localeCompare(a.name || '');
      }
      return 0;
    });
  }, [products, activeTab, filterBrand, filterGender, filterHighlight, searchQuery, sortBy]);

  // Derived counts for tabs
  const validProducts = Array.isArray(products) ? products.filter(Boolean) : [];
  const inStockCount = validProducts.filter(p => parseInt(p.stock || 0) > 0).length;
  const lowStockCount = validProducts.filter(p => parseInt(p.stock || 0) > 0 && parseInt(p.stock || 0) <= 5).length;
  const outOfStockCount = validProducts.filter(p => !p.stock || parseInt(p.stock || 0) === 0).length;

  const inputStyle = {
    width: '100%', 
    padding: '10px 14px', 
    border: '1px solid #e5e7eb', 
    borderRadius: '10px', 
    fontSize: '13px', 
    background: '#f9fafb', 
    color: '#111', 
    outline: 'none'
  };

  const labelStyle = { 
    display: 'block', 
    marginBottom: '6px', 
    fontSize: '11px', 
    color: '#888', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em' 
  };

  const frameColors = ['Black', 'Silver', 'Brown', 'Clear', 'White', 'Gold', 'Tortoise'].map(c => ({ label: c, value: c }));
  const lensColors = ['Black', 'Gray', 'Brown', 'Green', 'Blue', 'Clear', 'Pink'].map(c => ({ label: c, value: c }));
  const shapes = ['Square', 'Oval', 'Round', 'Cat-eye', 'Aviator'].map(c => ({ label: c, value: c }));
  const materials = ['Acetate', 'Metal', 'Mixed', 'Nylon'].map(c => ({ label: c, value: c }));
  const genders = ['Men', 'Women', 'Unisex', 'Kids'].map(c => ({ label: c, value: c }));
  const polarizeOptions = [{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}];
  const highlightOptions = [{label: 'New Arrival', value: 'New Arrival'}, {label: 'Best Seller', value: 'Best Seller'}];
  const brandOptions = (brands || []).map(b => ({ label: b?.name || '', value: b?.slug || '' }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Products</h2>
          <p className={styles.pageSubtitle}>Manage inventory and attributes</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => {
          if (isAdding) resetForm();
          else setIsAdding(true);
        }}>
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'Close Panel' : 'New Product'}
        </button>
      </div>

      {isAdding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
          <div className={styles.card} style={{ background: '#fff', padding: '40px', width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {formError && <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 500, background: '#fee2e2', padding: '6px 12px', borderRadius: '100px' }}>{formError}</span>}
                <button onClick={resetForm} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', transition: 'background 0.2s' }}>
                  <X size={16} />
                </button>
              </div>
            </div>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Same Add Form content... */}
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={labelStyle}>Product Images</label>
                <div style={{ flex: 1, minHeight: '220px', border: '1px dashed #bbb', borderRadius: '16px', display: 'flex', flexDirection: 'column', color: '#666', background: '#f9fafb', position: 'relative', overflow: 'hidden', padding: '12px' }}>
                  
                  {formData.images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#fff', border: formData.primaryImageIndex === idx ? '2px solid #111' : '1px solid #e5e7eb' }}>
                          <img src={imgUrl} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          
                          {/* Star for Primary */}
                          <button 
                            type="button" 
                            onClick={() => handleChange('primaryImageIndex', idx)}
                            style={{ position: 'absolute', top: '4px', left: '4px', background: formData.primaryImageIndex === idx ? '#111' : 'rgba(255,255,255,0.9)', color: formData.primaryImageIndex === idx ? '#fff' : '#ccc', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                            title="Set as Primary Image"
                          >
                            <span style={{ fontSize: '12px' }}>★</span>
                          </button>

                          {/* Delete Button */}
                          <button 
                            type="button" 
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== idx);
                              const newPrimary = formData.primaryImageIndex === idx ? 0 : (formData.primaryImageIndex > idx ? formData.primaryImageIndex - 1 : formData.primaryImageIndex);
                              setFormData(prev => ({ ...prev, images: newImages, primaryImageIndex: newPrimary }));
                            }}
                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      
                      {/* Add More Button */}
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 2 }} 
                        />
                        <Plus size={24} color="#999" />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 2 }} 
                      />
                      <UploadCloud size={32} style={{ marginBottom: '12px', color: '#888' }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#444' }}>Click or Drop images</span>
                      <span style={{ fontSize: '11px', opacity: 0.7, marginTop: '6px' }}>Add up to 5 images</span>
                    </div>
                  )}

                </div>
                {imageWarning && (
                  <div style={{ marginTop: '12px', padding: '8px 12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', color: '#d97706', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={14} />
                    {imageWarning}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={labelStyle}>Product Name *</label><input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} placeholder="e.g. Aden 02" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div><label style={labelStyle}>SKU</label><input type="text" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} style={inputStyle} placeholder="e.g. AD-02-BLK" /></div>
                  <div><label style={labelStyle}>Price (฿) *</label><input type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} style={inputStyle} placeholder="e.g. 15900" /></div>
                  <div><label style={labelStyle}>Stock Quantity</label><input type="number" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} style={inputStyle} placeholder="e.g. 15" /></div>
                </div>
                <div><label style={labelStyle}>Product Story / Description</label><textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Describe the inspiration, fit, and feel..." /></div>
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
              <div>
                <PillSelector label="Brand" options={brandOptions} selectedValue={formData.brandId} onChange={(val) => handleChange('brandId', val)} />
                <PillSelector label="Gender" options={genders} selectedValue={formData.gender} onChange={(val) => handleChange('gender', val)} />
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Dimensions (mm)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <input type="number" value={formData.sizeLens} onChange={(e) => handleChange('sizeLens', e.target.value)} style={inputStyle} placeholder="Lens (e.g. 52)" />
                    <input type="number" value={formData.sizeBridge} onChange={(e) => handleChange('sizeBridge', e.target.value)} style={inputStyle} placeholder="Bridge (e.g. 20)" />
                    <input type="number" value={formData.sizeTemple} onChange={(e) => handleChange('sizeTemple', e.target.value)} style={inputStyle} placeholder="Temple (e.g. 145)" />
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <PillSelector label="Frame Color" options={frameColors} selectedValue={formData.frameColor} onChange={(val) => handleChange('frameColor', val)} />
                  <PillSelector label="Lens Color" options={lensColors} selectedValue={formData.lensColor} onChange={(val) => handleChange('lensColor', val)} />
                  <PillSelector label="Shape" options={shapes} selectedValue={formData.shape} onChange={(val) => handleChange('shape', val)} />
                  <PillSelector label="Material" options={materials} selectedValue={formData.material} onChange={(val) => handleChange('material', val)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <PillSelector label="Polarized Lenses" options={polarizeOptions} selectedValue={formData.isPolarized} onChange={(val) => handleChange('isPolarized', val)} />
                  <MultiPillSelector label="Collection Highlight" options={highlightOptions} selectedValues={formData.highlight} onChange={(val) => handleChange('highlight', val)} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button type="button" onClick={resetForm} style={{ padding: '12px 24px', fontSize: '14px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '100px', cursor: 'pointer', fontWeight: 500, color: '#666' }}>Cancel</button>
              <button type="submit" className={styles.btnPrimary} style={{ padding: '12px 32px', fontSize: '14px' }}>{editingId ? 'Update Product' : 'Save Product'}</button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#fff' }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={filterBrand} 
            onChange={(e) => setFilterBrand(e.target.value)}
            style={{ padding: '10px 32px 10px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="All">All Brands</option>
            {brandOptions.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
          
          <select 
            value={filterHighlight} 
            onChange={(e) => setFilterHighlight(e.target.value)}
            style={{ padding: '10px 32px 10px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="All">All Collections</option>
            {highlightOptions.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
          </select>
          
          <select 
            value={filterGender} 
            onChange={(e) => setFilterGender(e.target.value)}
            style={{ padding: '10px 32px 10px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="All">All Genders</option>
            {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
          
          <div style={{ width: '1px', background: '#e5e7eb', margin: '0 4px' }}></div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '10px 32px 10px 16px', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="Newest">Sort: Newest</option>
            <option value="Oldest">Sort: Oldest</option>
            <option value="Name A-Z">Sort: Name A-Z</option>
            <option value="Name Z-A">Sort: Name Z-A</option>
          </select>
        </div>

      </div>

      {/* STATUS TABS */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0 0 12px 0',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#111' : '#888',
              borderBottom: activeTab === tab ? '2px solid #111' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {tab}
            <span style={{ 
              background: activeTab === tab ? '#f3f4f6' : 'transparent',
              padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600
            }}>
              {tab === 'All' ? validProducts.length : tab === 'In Stock' ? inStockCount : tab === 'Low Stock' ? lowStockCount : outOfStockCount}
            </span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className={styles.grid}>
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: '#888' }}>
            <Package size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#111', fontWeight: 500 }}>No products found</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className={styles.card} style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', background: '#f6f7f9', borderRadius: '12px', margin: '12px 12px 0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <img src={product.image} alt={product.name} style={{ width: '70%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                
                {/* Stock Indicator (Dot + Text, no background) */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexDirection: 'column' }}>
                  <span style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px',
                    color: '#111',
                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase'
                  }}>
                    <span style={{ 
                      display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
                      background: (!product.stock || parseInt(product.stock) === 0) ? '#999' : (product.stock && parseInt(product.stock) <= 5 && parseInt(product.stock) > 0) ? '#ffcc00' : '#10b981'
                    }}></span>
                    {(!product.stock || parseInt(product.stock) === 0) ? 'Out of Stock' : `${product.stock} in stock`}
                  </span>
                </div>

                {/* Highlights (Original Pink/Red squares) */}
                {Array.isArray(product.highlight) && product.highlight.length > 0 && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    {product.highlight.map(h => (
                      <span key={h} style={{ 
                        background: h === 'New Arrival' ? '#e4a5b1' : '#dc2626', 
                        color: '#fff', 
                        border: 'none',
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        fontSize: '9px', 
                        fontWeight: 700, 
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {h}
                      </span>
                    ))}
                  </div>
                )}
                {/* Fallback for old string data highlight */}
                {typeof product.highlight === 'string' && product.highlight !== 'None' && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                    <span style={{ 
                      background: product.highlight === 'New Arrival' ? '#e4a5b1' : '#dc2626', 
                      color: '#fff', 
                      border: 'none',
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '9px', 
                      fontWeight: 700, 
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {product.highlight}
                    </span>
                  </div>
                )}
              </div>
              
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: '#111' }}>{product.name}</h4>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>
                    {(product.price || '').toString().includes('฿') ? product.price : `฿${parseInt(product.price || 0).toLocaleString()}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{getBrandName(product.brandId)}</p>
                    {product.uploadDate && <p style={{ margin: 0, fontSize: '10px', color: '#bbb' }}>Added: {new Date(product.uploadDate).toLocaleDateString()}</p>}
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>SKU: {product.sku || 'N/A'}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', padding: '4px 8px', background: '#111', border: 'none', borderRadius: '100px', color: '#fff', fontWeight: 500 }}>{product.frameColor}</span>
                    <span style={{ fontSize: '10px', padding: '4px 8px', background: '#111', border: 'none', borderRadius: '100px', color: '#fff', fontWeight: 500 }}>{product.shape}</span>
                    {product.isPolarized === 'Yes' && (
                      <span style={{ fontSize: '10px', padding: '4px 8px', background: '#111', border: 'none', borderRadius: '100px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#007aff' }}></span>
                        Polarized
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(product)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cropImageSrc && (
        <ImageCropper 
          imageSrc={cropImageSrc} 
          onCropComplete={(croppedBase64) => {
            setFormData(prev => ({ 
              ...prev, 
              images: [...prev.images, croppedBase64] 
            }));
            setCropImageSrc(null);
          }}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    </div>
  );
};

export default ManageProductsPage;
