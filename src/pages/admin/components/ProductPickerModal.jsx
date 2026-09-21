import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Plus, Check, Tag } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatCurrency';

const ProductPickerModal = ({ 
  isOpen, 
  onClose, 
  onSelectProduct, 
  onCreateNewProduct, 
  currentSlot = null, 
  products = [], 
  categories = {},
  currentSetItemIds = [] 
}) => {
  const [search, setSearch] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedMainCategory('All');
      setSelectedSubCategory('All');
    }
  }, [isOpen]);

  // Handle Esc key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const mainCategories = useMemo(() => {
    return ['All', ...Object.keys(categories || {})];
  }, [categories]);

  const subCategories = useMemo(() => {
    if (selectedMainCategory === 'All' || !categories[selectedMainCategory]) {
      return [];
    }
    return ['All', ...(categories[selectedMainCategory] || [])];
  }, [categories, selectedMainCategory]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products || []).filter(p => {
      if (!p) return false;
      
      // Main category filter
      if (selectedMainCategory !== 'All' && p.mainCategory !== selectedMainCategory) {
        return false;
      }
      // Sub category filter
      if (selectedSubCategory !== 'All' && p.subCategory !== selectedSubCategory) {
        return false;
      }
      // Search query
      if (q) {
        const name = String(p.name || '').toLowerCase();
        const sku = String(p.sku || '').toLowerCase();
        const brand = String(p.brand || '').toLowerCase();
        const matchVariantSku = (p.colorVariants || p.color_variants || []).some(v => v.sku && String(v.sku).toLowerCase().includes(q));
        if (!name.includes(q) && !sku.includes(q) && !brand.includes(q) && !matchVariantSku) {
          return false;
        }
      }
      return true;
    });
  }, [products, search, selectedMainCategory, selectedSubCategory]);

  if (!isOpen) return null;

  const slotLabel = currentSlot?.layoutSize === 'large' ? '2x2 (Editorial Large)' : '1x1 (Standard)';

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
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div 
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: '#fafafa'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111' }}>
                Select Product for Look Set
              </h3>
              <span 
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  background: currentSlot?.layoutSize === 'large' ? '#fef3c7' : '#e5e7eb',
                  color: currentSlot?.layoutSize === 'large' ? '#92400e' : '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Slot: {slotLabel}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
              Pick an existing item from your inventory to place in this styling slot.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onCreateNewProduct && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCreateNewProduct();
                }}
                style={{
                  padding: '8px 14px',
                  background: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={14} /> + New Product
              </button>
            )}
            <button 
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#e5e7eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4b5563'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Search box */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search catalog by product name, SKU, or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 38px 10px 40px',
                fontSize: '14px',
                borderRadius: '100px',
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                outline: 'none',
                color: '#111'
              }}
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Main Category Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {mainCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedMainCategory(cat);
                  setSelectedSubCategory('All');
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: selectedMainCategory === cat ? 600 : 500,
                  border: selectedMainCategory === cat ? '1px solid #111' : '1px solid #e5e7eb',
                  background: selectedMainCategory === cat ? '#111' : '#fff',
                  color: selectedMainCategory === cat ? '#fff' : '#4b5563',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sub Category Pills (if main category selected) */}
          {subCategories.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingTop: '2px' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af', alignSelf: 'center', marginRight: '4px' }}>Sub:</span>
              {subCategories.map(sub => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: selectedSubCategory === sub ? 600 : 400,
                    border: selectedSubCategory === sub ? '1px solid #4b5563' : '1px solid #f3f4f6',
                    background: selectedSubCategory === sub ? '#f3f4f6' : '#fff',
                    color: selectedSubCategory === sub ? '#111' : '#6b7280',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCTS GRID / SCROLL AREA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>
              <Tag size={40} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#111', fontWeight: 600 }}>
                No products found
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#888' }}>
                {search ? `No catalog items matched "${search}".` : "No products available in this category."}
              </p>
              {onCreateNewProduct && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCreateNewProduct();
                  }}
                  style={{
                    padding: '8px 18px',
                    background: '#111',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Create "{search || 'New Product'}" now
                </button>
              )}
            </div>
          ) : (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px'
              }}
            >
              {filteredProducts.map(product => {
                const isAlreadyInSet = currentSetItemIds.includes(product.id);
                const displayPrice = formatCurrency(product.price);
                const categoryBadge = product.mainCategory ? `${product.mainCategory}${product.subCategory && product.subCategory !== 'All' ? ` › ${product.subCategory}` : ''}` : '';

                return (
                  <div
                    key={product.id}
                    title={isAlreadyInSet ? "Already in set" : "Select product"}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    style={{
                      background: '#fff',
                      border: isAlreadyInSet ? '1.5px solid #10b981' : '1px solid #e5e7eb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
                      if (!isAlreadyInSet) e.currentTarget.style.borderColor = '#111';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                      if (!isAlreadyInSet) e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: '100%', height: '170px', background: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
                      {product.image || product.coverImage ? (
                        <img 
                          src={product.image || product.coverImage} 
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '12px' }}>
                          No image
                        </div>
                      )}

                      {/* In-Set Badge */}
                      {isAlreadyInSet && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#10b981',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                          }}
                        >
                          <Check size={11} strokeWidth={3} /> In Set
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '8px' }}>
                      <div>
                        {categoryBadge && (
                          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
                            {categoryBadge}
                          </div>
                        )}
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', lineHeight: '1.3', marginBottom: '4px' }}>
                          {product.name}
                        </div>
                        {product.sku && (
                          <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                            SKU: {product.sku}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
                          {displayPrice}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb' }}>
                          Select →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div 
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafafa',
            fontSize: '12px',
            color: '#6b7280'
          }}
        >
          <span>Showing {filteredProducts.length} items from catalog</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              background: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPickerModal;
