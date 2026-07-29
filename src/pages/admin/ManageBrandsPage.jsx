import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, X, UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageCropper from '../../components/ImageCropper';
import styles from './AdminLayout.module.css';

const ManageBrandsPage = () => {
  const { brands, addBrand, deleteBrand, updateBrand, changeBrandOrder } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');
  const [newBrandBanner, setNewBrandBanner] = useState('');
  const [cropImageSrc, setCropImageSrc] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    
    let success = false;
    
    if (editId) {
      success = await updateBrand(editId, {
        name: newBrandName,
        description: newBrandDesc,
        banner: newBrandBanner || 'https://images.unsplash.com/photo-1577227448839-86cb7301c23a?auto=format&fit=crop&q=80&w=2000'
      });
    } else {
      success = await addBrand({
        name: newBrandName,
        description: newBrandDesc,
        banner: newBrandBanner || 'https://images.unsplash.com/photo-1577227448839-86cb7301c23a?auto=format&fit=crop&q=80&w=2000'
      });
    }
    
    if (success !== false) {
      closeModal();
    } else {
      alert("Failed to save changes. The image might be too large, or there was a network error.");
    }
  };

  const openEditModal = (brand) => {
    setEditId(brand.id);
    setNewBrandName(brand.name || '');
    setNewBrandDesc(brand.description || '');
    setNewBrandBanner(brand.banner || '');
    setIsAdding(true);
  };

  const openAddModal = () => {
    setEditId(null);
    setNewBrandName('');
    setNewBrandDesc('');
    setNewBrandBanner('');
    setIsAdding(true);
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditId(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Brands</h2>
          <p className={styles.pageSubtitle}>Manage your eyewear collections</p>
        </div>
        <button className={styles.btnPrimary} onClick={isAdding ? closeModal : openAddModal}>
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'Close Panel' : 'New Brand'}
        </button>
      </div>

      {isAdding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
          <div className={styles.card} style={{ background: '#fff', padding: '40px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111' }}>{editId ? 'Edit Brand' : 'Create New Brand'}</h3>
              <button onClick={closeModal} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', transition: 'background 0.2s' }}>
                <X size={16} />
              </button>
            </div>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
            
            {/* Image Upload Zone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cover Image</label>
              <label style={{ 
                width: '100%',
                aspectRatio: '21/9', 
                border: '1px dashed #bbb', 
                borderRadius: '16px', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#666',
                cursor: 'pointer',
                background: newBrandBanner ? `url(${newBrandBanner}) center/cover` : '#f9fafb',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }}
                />
                {!newBrandBanner && (
                  <>
                    <UploadCloud size={24} style={{ marginBottom: '12px' }} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Drag and drop image</span>
                    <span style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>or click to browse</span>
                  </>
                )}
                {newBrandBanner && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 500 }}>Click to change image</span>
                  </div>
                )}
              </label>
            </div>

            {/* Text Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand Name</label>
                <input 
                  type="text" 
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '10px 14px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '10px',
                    fontSize: '14px',
                    background: '#f9fafb',
                    color: '#111',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  placeholder="e.g. PRADA"
                  required
                />
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                <textarea 
                  value={newBrandDesc}
                  onChange={(e) => setNewBrandDesc(e.target.value)}
                  style={{ 
                    width: '100%', 
                    flex: 1,
                    padding: '10px 14px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '10px',
                    fontSize: '13px',
                    background: '#f9fafb',
                    color: '#111',
                    minHeight: '120px',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                  placeholder="Tell the story of this brand..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="submit" className={styles.btnPrimary} style={{ padding: '10px 24px' }}>{editId ? 'Save Changes' : 'Create Brand'}</button>
              </div>
            </div>
            
          </form>
          </div>
        </div>
      )}

      {/* Brand Grid instead of Table */}
      <div className={styles.grid}>
        {brands.map((brand, index) => (
          <div key={brand.id} className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ 
              width: '100%',
              aspectRatio: '21/9',
              backgroundImage: `url(${brand.banner || 'https://images.unsplash.com/photo-1577227448839-86cb7301c23a?auto=format&fit=crop&q=80&w=2000'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              {/* Reorder Dropdown */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: '14px', padding: '2px 8px 2px 12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#555', marginRight: '4px' }}>No.</span>
                <select 
                  value={index} 
                  onChange={(e) => { e.stopPropagation(); changeBrandOrder(brand.id, parseInt(e.target.value, 10)); }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#111',
                    cursor: 'pointer',
                    outline: 'none',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    padding: '4px'
                  }}
                >
                  {brands.map((_, i) => (
                    <option key={i} value={i}>{i + 1}</option>
                  ))}
                </select>
              </div>

              {/* Edit Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); openEditModal(brand); }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '46px',
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#111'
                }}
              >
                Edit
              </button>

              {/* Delete Button */}
              <button 
                onClick={() => deleteBrand(brand.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#111'
                }}
              >
                <X size={14} />
              </button>
            </div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 500, color: '#111' }}>{brand.name}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#555', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {brand.description || 'No description available for this brand.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {cropImageSrc && (
        <ImageCropper 
          imageSrc={cropImageSrc} 
          onCropComplete={(croppedBase64) => {
            setNewBrandBanner(croppedBase64);
            setCropImageSrc(null);
          }}
          onCancel={() => setCropImageSrc(null)}
          aspectRatio={21/9}
          showFocusBox={false}
        />
      )}
    </div>
  );
};

export default ManageBrandsPage;
