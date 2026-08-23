import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useAdmin } from '../../../../context/AdminContext';

const ProductSelectionDrawer = ({ onClose, onSelect }) => {
  const { products } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.mainCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100000,
      display: 'flex', justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '400px', backgroundColor: '#fff', height: '100%',
        display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Select Product</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', 
                border: '1px solid #eee', borderRadius: '8px', marginBottom: '12px',
                cursor: 'pointer', transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              onClick={() => onSelect(product)}
            >
              <img src={product.image} alt={product.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>{product.name}</div>
                <div style={{ color: '#666', fontSize: '13px' }}>${product.price}</div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionDrawer;
