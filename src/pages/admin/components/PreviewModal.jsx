import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import Nav from '../../../components/Nav';
import Footer from '../../../components/Footer';
import ProductsPage from '../../ProductsPage';

const PreviewModal = ({ sets, onClose }) => {
  const [viewport, setViewport] = useState('100%');

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', flexDirection: 'column'
    }}>
      {/* Top Control Bar */}
      <div style={{
        height: '60px', background: '#111', color: '#fff', display: 'flex', 
        alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 600 }}>Live Preview</span>
          <div style={{ display: 'flex', gap: '4px', background: '#333', padding: '4px', borderRadius: '8px' }}>
            <button onClick={() => setViewport('100%')} style={{ background: viewport === '100%' ? '#555' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Monitor size={16} /> Desktop
            </button>
            <button onClick={() => setViewport('768px')} style={{ background: viewport === '768px' ? '#555' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tablet size={16} /> Tablet
            </button>
            <button onClick={() => setViewport('375px')} style={{ background: viewport === '375px' ? '#555' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smartphone size={16} /> Mobile
            </button>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <X size={20} /> Close
        </button>
      </div>
      
      {/* Soft Top Banner */}
      <div style={{
        background: '#fef3c7',
        color: '#92400e',
        textAlign: 'center',
        padding: '10px',
        fontWeight: 500,
        fontSize: '13px',
        borderBottom: '1px solid #fde68a'
      }}>
        <span style={{ marginRight: '6px' }}>👁️</span>
        Preview Mode — Showing only product grid. Changes are not live until published.
      </div>

      {/* Iframe-like Container */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '24px 0', background: '#000' }}>
        <div style={{ 
          width: viewport, 
          background: '#fff', 
          height: '100%', 
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
          borderRadius: viewport === '100%' ? '0' : '12px',
          overflow: 'hidden'
        }}>
          {/* Scrollable Content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            
            <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
               <ProductsPage previewSets={sets} />
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
};

export default PreviewModal;
