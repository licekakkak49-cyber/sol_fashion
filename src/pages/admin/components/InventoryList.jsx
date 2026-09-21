import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Package, ChevronDown, ChevronUp, AlertCircle, Save, X, Box, Clock, SlidersHorizontal, RefreshCw } from 'lucide-react';

const SORT_OPTIONS = [
  { key: 'created_at', direction: 'desc', label: 'Newest' },
  { key: 'created_at', direction: 'asc', label: 'Oldest' },
  { key: 'status', direction: 'desc', label: 'Published first' },
  { key: 'status', direction: 'asc', label: 'Draft first' },
  { key: 'price', direction: 'desc', label: 'Price: High to Low' },
  { key: 'price', direction: 'asc', label: 'Price: Low to High' },
  { key: 'stock', direction: 'asc', label: 'Stock: Low to High' },
  { key: 'stock', direction: 'desc', label: 'Stock: High to Low' },
  { key: 'name', direction: 'asc', label: 'Name: A to Z' },
];

const formatDateTime = (dateVal) => {
  if (!dateVal) return { date: '-', time: '' };
  let dateObj;
  const num = Number(dateVal);
  if (!isNaN(num) && num > 1600000000000) {
    dateObj = new Date(num);
  } else {
    dateObj = new Date(dateVal);
  }
  if (isNaN(dateObj.getTime())) return { date: '-', time: '' };

  const day = dateObj.getDate().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  return {
    date: `${day} ${month} ${year}`,
    time: `${hours}:${minutes}`
  };
};

const getProductTimestamp = (p) => {
  if (p.created_at) {
    const t = new Date(p.created_at).getTime();
    if (!isNaN(t)) return t;
  }
  if (p.uploadDate) {
    const t = new Date(p.uploadDate).getTime();
    if (!isNaN(t)) return t;
  }
  if (p.createdAt) {
    const t = new Date(p.createdAt).getTime();
    if (!isNaN(t)) return t;
  }
  const num = Number(p.id);
  if (!isNaN(num) && num > 1600000000000) return num;
  return 0;
};

const getStatusRank = (p) => {
  const s = (p.status || 'draft').toLowerCase();
  if (s === 'active' || s === 'published') return 1;
  return 0;
};

export default function InventoryList({ 
  products, 
  handleEdit, 
  handleDelete, 
  toggleProductStatus, 
  handleFastUpdate, 
  onAddNew,
  isFilterOpen,
  onToggleFilter,
  activeFilterCount = 0,
  isMobile: isMobileProp = false,
  onRefresh,
  isSyncing = false
}) {
  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = isMobileProp || windowWidth <= 768;
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const [statusTab, setStatusTab] = useState('all'); // 'all', 'published', 'draft'
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  const [expandedRows, setExpandedRows] = useState({});
  const [restockModalData, setRestockModalData] = useState(null);
  const [isSavingFast, setIsSavingFast] = useState(false);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortOpen]);

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getMissingSizes = (product) => {
    const missing = [];
    (product.colorVariants || []).forEach(v => {
      if (v.stock) {
        Object.entries(v.stock).forEach(([size, qty]) => {
          if (qty === 0) missing.push(`${v.name || 'Original'} - ${size}`);
        });
      }
    });
    return missing;
  };

  const handleRestockSave = async () => {
    if (!restockModalData || !handleFastUpdate) return;
    setIsSavingFast(true);
    
    try {
      let totalStock = 0;
      restockModalData.colorVariants.forEach(v => {
        if (v.stock) {
          totalStock += Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
        }
      });
      
      const payload = {
        ...restockModalData,
        stock: totalStock,
        status: totalStock > 0 ? 'active' : 'draft'
      };
      
      await handleFastUpdate(payload);
      setRestockModalData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingFast(false);
    }
  };

  // Status counts
  const counts = useMemo(() => {
    let published = 0;
    let draft = 0;
    (products || []).forEach(p => {
      const s = (p.status || 'draft').toLowerCase();
      if (s === 'active' || s === 'published') {
        published++;
      } else {
        draft++;
      }
    });
    return {
      all: (products || []).length,
      published,
      draft
    };
  }, [products]);

  // Filter and sort products
  const sortedProducts = useMemo(() => {
    let list = [...(products || [])];

    // 1. Filter by statusTab
    if (statusTab === 'published') {
      list = list.filter(p => {
        const s = (p.status || 'draft').toLowerCase();
        return s === 'active' || s === 'published';
      });
    } else if (statusTab === 'draft') {
      list = list.filter(p => {
        const s = (p.status || 'draft').toLowerCase();
        return s === 'draft';
      });
    }

    // 2. Sort
    list.sort((a, b) => {
      let cmp = 0;
      if (sortConfig.key === 'created_at' || sortConfig.key === 'createdAt') {
        cmp = getProductTimestamp(a) - getProductTimestamp(b);
      } else if (sortConfig.key === 'status') {
        cmp = getStatusRank(a) - getStatusRank(b);
      } else if (sortConfig.key === 'stock') {
        cmp = (Number(a.stock) || 0) - (Number(b.stock) || 0);
      } else if (sortConfig.key === 'price') {
        cmp = (Number(a.price) || 0) - (Number(b.price) || 0);
      } else if (sortConfig.key === 'name') {
        cmp = String(a.name || '').localeCompare(String(b.name || ''));
      } else if (sortConfig.key === 'mainCategory') {
        cmp = String(a.mainCategory || '').localeCompare(String(b.mainCategory || ''));
      } else {
        cmp = String(a[sortConfig.key] || '').localeCompare(String(b[sortConfig.key] || ''));
      }

      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [products, statusTab, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} color='#111' strokeWidth={3} /> : <ArrowDown size={14} color='#111' strokeWidth={3} />; 
  };

  const currentSortOption = SORT_OPTIONS.find(
    opt => opt.key === sortConfig.key && opt.direction === sortConfig.direction
  );
  const currentSortLabel = currentSortOption ? currentSortOption.label : 'Sort';

  if (products.length === 0) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', color: '#888', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
        <Package size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#111', fontWeight: 600 }}>No products found</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}>Try adjusting your search or category filters, or add a new product to inventory.</p>
        {onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            style={{
              padding: '10px 22px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Plus size={16} /> Add First Product
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        /* Mobile 1-Row Utility Bar */
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '14px', 
          gap: '8px' 
        }}>
          {/* Status Tabs compact segmented control */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            background: '#f3f4f6', 
            padding: '3px', 
            borderRadius: '100px',
            gap: '2px'
          }}>
            <button
              type="button"
              onClick={() => setStatusTab('all')}
              style={{
                padding: '5px 10px',
                borderRadius: '100px',
                border: 'none',
                background: statusTab === 'all' ? '#fff' : 'transparent',
                color: statusTab === 'all' ? '#111' : '#6b7280',
                fontWeight: statusTab === 'all' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: statusTab === 'all' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <span>All</span>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>({counts.all})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusTab('published')}
              style={{
                padding: '5px 10px',
                borderRadius: '100px',
                border: 'none',
                background: statusTab === 'published' ? '#fff' : 'transparent',
                color: statusTab === 'published' ? '#065f46' : '#6b7280',
                fontWeight: statusTab === 'published' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: statusTab === 'published' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
              <span>Live</span>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>({counts.published})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusTab('draft')}
              style={{
                padding: '5px 10px',
                borderRadius: '100px',
                border: 'none',
                background: statusTab === 'draft' ? '#fff' : 'transparent',
                color: statusTab === 'draft' ? '#92400e' : '#6b7280',
                fontWeight: statusTab === 'draft' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: statusTab === 'draft' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
              <span>Draft</span>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>({counts.draft})</span>
            </button>
          </div>

          {/* Right Action Controls: Filters & Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {onToggleFilter && (
              <button
                type="button"
                onClick={onToggleFilter}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 10px',
                  background: isFilterOpen || activeFilterCount > 0 ? '#111' : '#fff',
                  border: isFilterOpen || activeFilterCount > 0 ? '1px solid #111' : '1px solid #e5e7eb',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isFilterOpen || activeFilterCount > 0 ? '#fff' : '#374151',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
              >
                <SlidersHorizontal size={13} color={isFilterOpen || activeFilterCount > 0 ? '#fff' : '#6b7280'} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      borderRadius: '100px',
                      padding: '0 5px',
                      fontSize: '10px',
                      fontWeight: 700,
                      lineHeight: '14px',
                      minWidth: '14px',
                      textAlign: 'center'
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Sort Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileSortOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#111',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <ArrowUpDown size={13} />
              <span>Sort</span>
            </button>
          </div>
        </div>
      ) : (
        /* Desktop Toolbar */
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px 0', color: '#111' }}>
                Product Catalog & Inventory
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                Managing {products.length} products in catalog
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '16px', 
            flexWrap: 'wrap', 
            gap: '12px' 
          }}>
            {/* Quick Status Tabs */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              background: '#f3f4f6', 
              padding: '4px', 
              borderRadius: '100px' 
            }}>
              <button
                type="button"
                onClick={() => setStatusTab('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: 'none',
                  background: statusTab === 'all' ? '#fff' : 'transparent',
                  color: statusTab === 'all' ? '#111' : '#6b7280',
                  fontWeight: statusTab === 'all' ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: statusTab === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <span>All</span>
                <span style={{ 
                  background: statusTab === 'all' ? '#f3f4f6' : 'rgba(0,0,0,0.06)', 
                  padding: '1px 7px', 
                  borderRadius: '100px', 
                  fontSize: '11px', 
                  fontWeight: 600 
                }}>
                  {counts.all}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusTab('published')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: 'none',
                  background: statusTab === 'published' ? '#fff' : 'transparent',
                  color: statusTab === 'published' ? '#065f46' : '#6b7280',
                  fontWeight: statusTab === 'published' ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: statusTab === 'published' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                <span>Published</span>
                <span style={{ 
                  background: statusTab === 'published' ? '#ecfdf5' : 'rgba(0,0,0,0.06)', 
                  color: statusTab === 'published' ? '#065f46' : 'inherit',
                  padding: '1px 7px', 
                  borderRadius: '100px', 
                  fontSize: '11px', 
                  fontWeight: 600 
                }}>
                  {counts.published}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusTab('draft')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: 'none',
                  background: statusTab === 'draft' ? '#fff' : 'transparent',
                  color: statusTab === 'draft' ? '#92400e' : '#6b7280',
                  fontWeight: statusTab === 'draft' ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: statusTab === 'draft' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} />
                <span>Draft</span>
                <span style={{ 
                  background: statusTab === 'draft' ? '#fffbeb' : 'rgba(0,0,0,0.06)', 
                  color: statusTab === 'draft' ? '#92400e' : 'inherit',
                  padding: '1px 7px', 
                  borderRadius: '100px', 
                  fontSize: '11px', 
                  fontWeight: 600 
                }}>
                  {counts.draft}
                </span>
              </button>
            </div>

            {/* Right Controls: Filters & Dedicated Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isSyncing}
                  title="Sync products with database"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    cursor: isSyncing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    opacity: isSyncing ? 0.7 : 1
                  }}
                >
                  <RefreshCw size={13} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                </button>
              )}
              {onToggleFilter && (
                <button
                  type="button"
                  onClick={onToggleFilter}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: isFilterOpen ? '#111' : '#fff',
                    border: isFilterOpen ? '1px solid #111' : '1px solid #e5e7eb',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: isFilterOpen ? '#fff' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                >
                  <SlidersHorizontal size={14} color={isFilterOpen ? '#fff' : '#6b7280'} />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span
                      style={{
                        background: isFilterOpen ? '#fff' : '#111',
                        color: isFilterOpen ? '#111' : '#fff',
                        borderRadius: '100px',
                        padding: '0 6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        lineHeight: '16px',
                        minWidth: '16px',
                        textAlign: 'center'
                      }}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              )}

              {/* Dedicated Sort Dropdown */}
              <div style={{ position: 'relative' }} ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: isSortOpen ? '#f3f4f6' : '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#111',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <ArrowUpDown size={14} />
                  <span>Sort: {currentSortLabel}</span>
                  <ChevronDown size={14} style={{ transform: isSortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {isSortOpen && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '14px',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                      width: '240px',
                      zIndex: 50,
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div style={{ padding: '6px 10px 4px', fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Sort by
                    </div>
                    {SORT_OPTIONS.map(opt => {
                      const isSelected = sortConfig.key === opt.key && sortConfig.direction === opt.direction;
                      return (
                        <button
                          key={`${opt.key}-${opt.direction}`}
                          type="button"
                          onClick={() => {
                            setSortConfig({ key: opt.key, direction: opt.direction });
                            setIsSortOpen(false);
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isSelected ? '#f3f4f6' : 'transparent',
                            color: isSelected ? '#111' : '#4b5563',
                            fontSize: '13px',
                            fontWeight: isSelected ? 600 : 400,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            textAlign: 'left',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f9fafb'; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Product Display: Desktop Table vs Mobile Cards */}
      {!isMobile ? (
        /* Main Table (Desktop) */
        <div style={{ width: '100%', overflowX: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                <th onClick={() => requestSort('mainCategory')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'mainCategory' ? '#111' : '#4b5563', background: sortConfig.key === 'mainCategory' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Category {getSortIcon('mainCategory')}</div>
                </th>
                <th onClick={() => requestSort('price')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'price' ? '#111' : '#4b5563', background: sortConfig.key === 'price' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Price {getSortIcon('price')}</div>
                </th>
                <th onClick={() => requestSort('stock')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'stock' ? '#111' : '#4b5563', background: sortConfig.key === 'stock' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Stock {getSortIcon('stock')}</div>
                </th>
                <th onClick={() => requestSort('status')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'status' ? '#111' : '#4b5563', background: sortConfig.key === 'status' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Status {getSortIcon('status')}</div>
                </th>
                <th onClick={() => requestSort('created_at')} style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: sortConfig.key === 'created_at' ? '#111' : '#4b5563', background: sortConfig.key === 'created_at' ? '#f3f4f6' : 'transparent', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Date Added {getSortIcon('created_at')}</div>
                </th>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: '#888' }}>
                    <Package size={36} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#111', marginBottom: '4px' }}>
                      No products found in this tab
                    </div>
                    <div style={{ fontSize: '13px', color: '#888' }}>
                      {statusTab === 'published' ? 'There are no published products currently.' : statusTab === 'draft' ? 'There are no draft products currently.' : 'No products found.'}
                    </div>
                  </td>
                </tr>
              ) : sortedProducts.map((product, index) => {
                const isExpanded = !!expandedRows[product.id];
                const missingSizes = getMissingSizes(product);
                const hasMissing = missingSizes.length > 0;

                const stock = Number(product.stock) || 0;
                const isPublished = (product.status || 'draft').toLowerCase() === 'active' || (product.status || 'draft').toLowerCase() === 'published';
                const dt = formatDateTime(product.created_at || product.createdAt || product.id);

                return (
                  <React.Fragment key={product.id}>
                  <tr 
                    style={{ 
                      borderBottom: isExpanded ? 'none' : (index === sortedProducts.length - 1 ? 'none' : '1px solid #e5e7eb'), 
                      transition: 'background 0.2s', 
                      background: isExpanded ? '#f9fafb' : 'transparent' 
                    }} 
                    onMouseOver={(e) => {if(!isExpanded) e.currentTarget.style.background = '#f9fafb'}} 
                    onMouseOut={(e) => {if(!isExpanded) e.currentTarget.style.background = 'transparent'}}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (product.coverImage || product.image) ? (
                            <img src={product.coverImage || product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '10px' }}>No Img</div>
                          )}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ fontWeight: 500, color: '#111', fontSize: '14px' }}>{product.name || 'Unnamed Product'}</div>
                            {(() => {
                              const mainV = (product.colorVariants || []).find(v => v.isMain);
                              if (mainV) {
                                const isPattern = mainV.swatchType === 'pattern' && mainV.patternImage;
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f3f4f6', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                                    <div style={{ 
                                      width: 12, 
                                      height: 12, 
                                      borderRadius: '2px', 
                                      background: isPattern ? `url(${mainV.patternImage}) center / cover no-repeat` : (mainV.hex || '#000'), 
                                      border: '1px solid #e5e7eb',
                                      flexShrink: 0
                                    }} /> 
                                    {mainV.name || (isPattern ? 'Pattern' : 'Original')}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                            {hasMissing && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}><AlertCircle size={10} /> Missing Sizes</div>}
                            {product.layoutSize === 'large' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', background: '#111', color: '#fff' }}>
                                2x2
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            ID: {String(product.id).substring(0, 8)}
                            {product.colorVariants && product.colorVariants.length > 1 && (
                              <span onClick={() => toggleRow(product.id)} style={{ color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 500, borderBottom: '1px solid #d1d5db', paddingBottom: '1px' }}>
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} 
                                {isExpanded ? 'Hide Variants' : 'Show Variants'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: sortConfig.key === 'mainCategory' ? '#111' : '#4b5563' }}>
                      <div style={{ fontWeight: 500 }}>{product.mainCategory || 'Uncategorized'}</div>
                      {product.subCategory && <div style={{ fontSize: '12px', color: '#9ca3af' }}>{product.subCategory}</div>}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#111', fontWeight: 500 }}>
                      ${Number(product.price || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        padding: '4px 10px', 
                        borderRadius: '100px', 
                        fontSize: '12px', 
                        fontWeight: 600,
                        background: stock === 0 ? '#fee2e2' : stock < 10 ? '#fef3c7' : '#dcfce3',
                        color: stock === 0 ? '#dc2626' : stock < 10 ? '#d97706' : '#16a34a'
                      }}>
                        {stock} in stock
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button
                        type="button"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (toggleProductStatus) toggleProductStatus(product); 
                        }}
                        title={isPublished ? 'Published' : 'Draft'}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          padding: '5px 12px', 
                          borderRadius: '100px', 
                          fontSize: '12px', 
                          fontWeight: 600,
                          border: isPublished ? '1px solid #c7d2fe' : '1px solid #e5e7eb',
                          background: isPublished ? '#eef2ff' : '#f9fafb',
                          color: isPublished ? '#4338ca' : '#6b7280',
                          cursor: 'pointer',
                          userSelect: 'none',
                          transition: 'all 0.15s',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                        }}
                      >
                        <span style={{ 
                          width: '7px', 
                          height: '7px', 
                          borderRadius: '50%', 
                          background: isPublished ? '#10b981' : '#9ca3af',
                          boxShadow: isPublished ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none' 
                        }} />
                        {isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 500, color: '#111' }}>{dt.date}</div>
                      {dt.time && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={11} /> {dt.time}</div>}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          onClick={() => setRestockModalData(JSON.parse(JSON.stringify(product)))}
                          style={{ padding: '6px 10px', background: '#111', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                          title="Quick Restock"
                        >
                          <Box size={14} /> Restock
                        </button>
                        <button 
                          onClick={() => handleEdit(product)}
                          style={{ padding: '6px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        {handleDelete && (
                          <button 
                            onClick={() => handleDelete(product.id)}
                            style={{ padding: '6px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ background: '#f9fafb', borderBottom: index === sortedProducts.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                      <td colSpan={7} style={{ padding: '0 16px 16px 68px' }}>
                      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '16px' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#111' }}>Variant Stock Breakdown</h4>
                        {(!product.colorVariants || product.colorVariants.length === 0) ? (
                          <div style={{ fontSize: '12px', color: '#666' }}>No variants configured.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {product.colorVariants.map((v, vIdx) => (
                              <div key={vIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ minWidth: '160px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
                                  <div style={{ 
                                    width: '18px', 
                                    height: '18px', 
                                    borderRadius: '4px', 
                                    background: (v.swatchType === 'pattern' && v.patternImage) ? `url(${v.patternImage}) center / cover no-repeat` : (v.hex || '#000'), 
                                    border: '1px solid #e5e7eb',
                                    flexShrink: 0 
                                  }} />
                                  <div>
                                    <div>{v.name || (v.swatchType === 'pattern' ? 'Pattern' : 'Original')}</div>
                                    {v.sku && (
                                      <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace', fontWeight: 400 }}>
                                        SKU: {v.sku}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                                  {v.stock ? Object.entries(v.stock).map(([size, qty]) => (
                                    <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: qty === 0 ? '#fee2e2' : '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                      <span style={{ fontWeight: 600, color: '#4b5563' }}>{size}</span>
                                      <span style={{ color: qty === 0 ? '#dc2626' : '#111', fontWeight: qty === 0 ? 600 : 400 }}>{qty}</span>
                                    </div>
                                  )) : <div style={{ fontSize: '12px', color: '#999' }}>No stock data</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      ) : (
        /* Mobile Product Cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedProducts.length === 0 ? (
            <div style={{ padding: '48px 16px', textAlign: 'center', color: '#888', background: '#fff', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
              <Package size={36} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#111', marginBottom: '4px' }}>
                No products found in this tab
              </div>
              <div style={{ fontSize: '13px', color: '#888' }}>
                {statusTab === 'published' ? 'There are no published products currently.' : statusTab === 'draft' ? 'There are no draft products currently.' : 'No products found.'}
              </div>
            </div>
          ) : (
            sortedProducts.map((product) => {
              const isExpanded = !!expandedRows[product.id];
              const missingSizes = getMissingSizes(product);
              const hasMissing = missingSizes.length > 0;
              const stock = Number(product.stock) || 0;
              const isPublished = (product.status || 'draft').toLowerCase() === 'active' || (product.status || 'draft').toLowerCase() === 'published';
              const thumbImg = (product.images && product.images.length > 0) ? product.images[0] : (product.coverImage || product.image);
              const hasVariants = product.colorVariants && product.colorVariants.length > 1;

              return (
                <div 
                  key={product.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    padding: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Top: Image + Info + Quick Status Toggle */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {/* Thumbnail */}
                    <div 
                      onClick={() => handleEdit(product)}
                      style={{ 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '8px', 
                        overflow: 'hidden', 
                        background: '#f3f4f6', 
                        flexShrink: 0,
                        cursor: 'pointer'
                      }}
                    >
                      {thumbImg ? (
                        <img src={thumbImg} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '10px' }}>No Img</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span 
                          onClick={() => handleEdit(product)}
                          style={{ fontWeight: 600, color: '#111', fontSize: '14px', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {product.name || 'Unnamed Product'}
                        </span>
                        {hasMissing && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#fee2e2', color: '#dc2626', padding: '1px 5px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                            <AlertCircle size={9} /> Missing
                          </span>
                        )}
                        {product.layoutSize === 'large' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '1px 5px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', background: '#111', color: '#fff' }}>
                            2x2
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>
                          {product.mainCategory || 'Uncategorized'}{product.subCategory ? ` › ${product.subCategory}` : ''}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>
                          ${Number(product.price || 0).toLocaleString()}
                        </span>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          padding: '2px 8px', 
                          borderRadius: '100px', 
                          fontSize: '11px', 
                          fontWeight: 600,
                          background: stock === 0 ? '#fee2e2' : stock < 10 ? '#fef3c7' : '#dcfce3',
                          color: stock === 0 ? '#dc2626' : stock < 10 ? '#d97706' : '#16a34a'
                        }}>
                          {stock} in stock
                        </span>
                      </div>
                    </div>

                    {/* Direct Status Toggle (1-tap) */}
                    <button
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (toggleProductStatus) toggleProductStatus(product); 
                      }}
                      title={isPublished ? 'Live on store - click to draft' : 'Draft - click to publish'}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        padding: '4px 8px', 
                        borderRadius: '100px', 
                        fontSize: '11px', 
                        fontWeight: 600,
                        border: isPublished ? '1px solid #c7d2fe' : '1px solid #e5e7eb',
                        background: isPublished ? '#eef2ff' : '#f9fafb',
                        color: isPublished ? '#4338ca' : '#6b7280',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <span style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: isPublished ? '#10b981' : '#9ca3af'
                      }} />
                      {isPublished ? 'Live' : 'Draft'}
                    </button>
                  </div>

                  {/* Bottom Row: Metadata & Quick Actions */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    paddingTop: '10px', 
                    borderTop: '1px solid #f3f4f6',
                    gap: '8px'
                  }}>
                    {/* Left: ID & Variants toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                        #{String(product.id).substring(0, 6)}
                      </span>
                      {hasVariants && (
                        <button
                          type="button"
                          onClick={() => toggleRow(product.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#4b5563',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: 0
                          }}
                        >
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {isExpanded ? 'Hide' : 'Variants'} ({product.colorVariants.length})
                        </button>
                      )}
                    </div>

                    {/* Right: Restock, Edit, Delete buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        type="button"
                        onClick={() => setRestockModalData(JSON.parse(JSON.stringify(product)))}
                        style={{ 
                          padding: '5px 10px', 
                          background: '#111', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          color: '#fff', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          fontSize: '11px', 
                          fontWeight: 600 
                        }}
                        title="Quick Restock"
                      >
                        <Box size={12} /> Restock
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleEdit(product)}
                        style={{ 
                          width: '28px', 
                          height: '28px', 
                          background: '#f3f4f6', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          color: '#4b5563', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                        title="Edit Product"
                      >
                        <Edit2 size={13} />
                      </button>
                      {handleDelete && (
                        <button 
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          style={{ 
                            width: '28px', 
                            height: '28px', 
                            background: '#fee2e2', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            color: '#dc2626', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Variant Details on Mobile */}
                  {isExpanded && (
                    <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '12px', border: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Variant Breakdown
                      </div>
                      {product.colorVariants.map((v, vIdx) => (
                        <div key={vIdx} style={{ marginBottom: vIdx < product.colorVariants.length - 1 ? '10px' : 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                            <div style={{ 
                              width: '12px', 
                              height: '12px', 
                              borderRadius: '3px', 
                              background: (v.swatchType === 'pattern' && v.patternImage) ? `url(${v.patternImage}) center / cover no-repeat` : (v.hex || '#000'), 
                              border: '1px solid #d1d5db',
                              flexShrink: 0 
                            }} />
                            <div>
                              <span>{v.name || (v.swatchType === 'pattern' ? 'Pattern' : 'Original')}</span>
                              {v.sku && (
                                <span style={{ marginLeft: '6px', fontSize: '10px', color: '#6b7280', fontWeight: 'normal', fontFamily: 'monospace' }}>
                                  ({v.sku})
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {v.stock ? Object.entries(v.stock).map(([size, qty]) => (
                              <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: qty === 0 ? '#fee2e2' : '#fff', border: '1px solid #e5e7eb', padding: '3px 6px', borderRadius: '4px', fontSize: '11px' }}>
                                <span style={{ fontWeight: 600, color: '#4b5563' }}>{size}:</span>
                                <span style={{ color: qty === 0 ? '#dc2626' : '#111', fontWeight: qty === 0 ? 700 : 500 }}>{qty}</span>
                              </div>
                            )) : <span style={{ fontSize: '11px', color: '#999' }}>No size data</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {isMobile && isMobileSortOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsMobileSortOpen(false)}
        >
          <div 
            style={{
              background: '#ffffff',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '20px 20px 32px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '36px', height: '4px', background: '#e5e7eb', borderRadius: '2px', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#111' }}>Sort Products</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>Choose order for catalog items</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsMobileSortOpen(false)}
                style={{ border: 'none', background: '#f3f4f6', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} color="#666" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {SORT_OPTIONS.map(opt => {
                const isSelected = sortConfig.key === opt.key && sortConfig.direction === opt.direction;
                return (
                  <button
                    key={`${opt.key}-${opt.direction}`}
                    type="button"
                    onClick={() => {
                      setSortConfig({ key: opt.key, direction: opt.direction });
                      setIsMobileSortOpen(false);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isSelected ? '#f3f4f6' : 'transparent',
                      color: isSelected ? '#111' : '#374151',
                      fontSize: '14px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <span style={{ color: '#10b981', fontWeight: 700, fontSize: '16px' }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {restockModalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '500px', maxWidth: isMobile ? '94vw' : '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Quick Restock</h2>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{restockModalData.name}</div>
              </div>
              <button onClick={() => setRestockModalData(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}><X size={20} color="#666" /></button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {(!restockModalData.colorVariants || restockModalData.colorVariants.length === 0) ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '24px' }}>No variants found for this product.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {restockModalData.colorVariants.map((v, vIdx) => (
                    <div key={vIdx}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
                        <div style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '4px', 
                          background: (v.swatchType === 'pattern' && v.patternImage) ? `url(${v.patternImage}) center / cover no-repeat` : (v.hex || '#000'), 
                          border: '1px solid #e5e7eb',
                          flexShrink: 0 
                        }} />
                        {v.name || (v.swatchType === 'pattern' ? 'Pattern' : 'Original')}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {v.stock && Object.keys(v.stock).length > 0 ? (
                          Object.keys(v.stock).map(size => (
                            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '60px' }}>
                              <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>{size}</span>
                              <input 
                                type="number" 
                                min="0" 
                                value={v.stock[size] || 0} 
                                onChange={(e) => {
                                  const newData = { ...restockModalData };
                                  newData.colorVariants[vIdx].stock[size] = parseInt(e.target.value) || 0;
                                  setRestockModalData(newData);
                                }}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', textAlign: 'center', boxSizing: 'border-box' }}
                              />
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: '12px', color: '#999' }}>No sizes tracked for this color. Please edit product fully.</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#f9fafb', borderRadius: '0 0 12px 12px' }}>
              <button onClick={() => setRestockModalData(null)} style={{ padding: '8px 16px', borderRadius: '100px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleRestockSave} disabled={isSavingFast} style={{ padding: '8px 24px', borderRadius: '100px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Save size={16} /> {isSavingFast ? 'Saving...' : 'Save Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
  </>
  );
}
