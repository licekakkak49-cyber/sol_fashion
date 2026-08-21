import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Package } from 'lucide-react';

export default function InventoryList({ products, handleEdit, handleDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

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
            const stock = Number(product.stock) || 0;
            return (
              <tr key={product.id} style={{ borderBottom: index === sortedProducts.length - 1 ? 'none' : '1px solid #e5e7eb', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
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
                      <div style={{ fontWeight: 500, color: '#111', fontSize: '14px' }}>{product.name || 'Unnamed Product'}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {product.id.substring(0, 8)}</div>
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
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    background: product.status === 'active' ? '#e0e7ff' : '#f3f4f6',
                    color: product.status === 'active' ? '#4f46e5' : '#4b5563',
                    textTransform: 'capitalize'
                  }}>
                    {product.status || 'draft'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      onClick={() => handleEdit(product)}
                      style={{ padding: '6px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', color: sortConfig.key === '' ? '#111' : '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
