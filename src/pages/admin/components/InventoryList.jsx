import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Package, ChevronDown, ChevronUp, AlertCircle, Save, X, Box } from 'lucide-react';

export default function InventoryList({ products, handleEdit, handleDelete, toggleProductStatus, handleFastUpdate }) {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState({});
  const [restockModalData, setRestockModalData] = useState(null);
  const [isSavingFast, setIsSavingFast] = useState(false);

  
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
      // Calculate new total stock
      let totalStock = 0;
      restockModalData.colorVariants.forEach(v => {
        if (v.stock) {
          totalStock += Object.values(v.stock).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
        }
      });
      
      const payload = {
        ...restockModalData,
        stock: totalStock,
        status: totalStock > 0 ? 'In Stock' : 'Out of Stock'
      };
      
      await handleFastUpdate(payload);
      setRestockModalData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingFast(false);
    }
  };

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig.key !== null) {
      sortableProducts.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'stock' || sortConfig.key === 'price') {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

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

  if (products.length === 0) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', color: '#888', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb' }}>
        <Package size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#111', fontWeight: 500 }}>No products found</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Try adjusting your search or category filters.</p>
      </div>
    );
  }

  return (
    <>
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
            <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product, index) => {
            const isExpanded = !!expandedRows[product.id];
            const missingSizes = getMissingSizes(product);
            const hasMissing = missingSizes.length > 0;

            const stock = Number(product.stock) || 0;
            return (
              <React.Fragment key={product.id}>
              <tr style={{ borderBottom: isExpanded ? 'none' : (index === sortedProducts.length - 1 ? 'none' : '1px solid #e5e7eb'), transition: 'background 0.2s', background: isExpanded ? '#f9fafb' : 'transparent' }} onMouseOver={(e) => {if(!isExpanded) e.currentTarget.style.background = '#f9fafb'}} onMouseOut={(e) => {if(!isExpanded) e.currentTarget.style.background = 'transparent'}}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '10px' }}>No Img</div>
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontWeight: 500, color: '#111', fontSize: '14px' }}>{product.name || 'Unnamed Product'}</div>
                        {(() => {
                          const mainV = (product.colorVariants || []).find(v => v.isMain);
                          if (mainV) return <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f3f4f6', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}><div style={{ width: 12, height: 12, borderRadius: '2px', background: mainV.hex || '#000', border: '1px solid #e5e7eb' }} /> {mainV.name || 'Original'}</div>;
                          return null;
                        })()}
                        {hasMissing && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}><AlertCircle size={10} /> Missing Sizes</div>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ID: {product.id.substring(0, 8)}
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
                <td style={{ padding: '16px', fontSize: '14px', color: sortConfig.key === '' ? '#111' : '#4b5563' }}>
                  <div style={{ fontWeight: 500 }}>{product.mainCategory || 'Uncategorized'}</div>
                  {product.subCategory && <div style={{ fontSize: '12px', color: '#9ca3af' }}>{product.subCategory}</div>}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#111', fontWeight: 500 }}>
                  ฿{(product.price || 0).toLocaleString()}
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
                  <span 
                    onClick={(e) => { e.stopPropagation(); if (toggleProductStatus) toggleProductStatus(product); }}
                    style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    background: product.status === 'active' ? '#e0e7ff' : '#f3f4f6',
                    color: product.status === 'active' ? '#4f46e5' : '#4b5563',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s'
                  }}>
                    {product.status === 'active' ? 'Published' : 'Draft'}
                  </span>
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
                  <td colSpan={6} style={{ padding: '0 16px 16px 68px' }}>
                    <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '16px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#111' }}>Variant Stock Breakdown</h4>
                      {(!product.colorVariants || product.colorVariants.length === 0) ? (
                        <div style={{ fontSize: '12px', color: '#666' }}>No variants configured.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {product.colorVariants.map((v, vIdx) => (
                            <div key={vIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                              <div style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: v.hex || '#000', border: '1px solid #e5e7eb' }} />
                                {v.name || 'Original'}
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

      {restockModalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '500px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
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
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: v.hex || '#000', border: '1px solid #e5e7eb' }} />
                        {v.name || 'Original'}
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
