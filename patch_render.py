import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old_render = '''              if (item.isPlaceholder) {
                return (
                  <div key={product.id}>
                    <div 
                      onClick={(e) => {
                        if (isDraggingRef.current) { e.preventDefault(); return; }
                        handlePlaceholderClick(product);
                      }}
                      style={{ 
                        height: '100%', 
                        border: layoutSize === 'large' ? '2px dashed #3b82f6' : '2px dashed #cbd5e1', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: layoutSize === 'large' ? '#eff6ff' : '#f8fafc',
                        cursor: 'pointer',
                        color: layoutSize === 'large' ? '#1d4ed8' : '#64748b' 
                      }}
                    >
                      <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>Click to Upload</span>
                      <span style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{layoutSize === 'large' ? '2x2 (Large)' : '1x1 (Small)'}</span>
                      
                      {/* Actions */}
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '4px' }}>
                         <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: '#64748b' }}>Resize</button>
                         <button onClick={(e) => { e.stopPropagation(); removeProductFromSet(set.id, product.id); }} style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: '#dc2626' }}>Remove</button>
                      </div>
                    </div>
                  </div>
                );
              }'''

new_render = '''              if (item.isHidden) {
                return (
                  <div key={product.id}>
                    <div 
                      onClick={(e) => {
                        if (isDraggingRef.current) { e.preventDefault(); return; }
                        updateProductInSet(set.id, product.id, { isHidden: false });
                      }}
                      style={{ 
                        height: '100%', 
                        border: '2px dashed #f1f5f9', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        color: '#cbd5e1' 
                      }}
                    >
                      <Plus size={32} style={{ opacity: 0.5 }} />
                    </div>
                  </div>
                );
              }

              if (item.isPlaceholder) {
                return (
                  <div key={product.id}>
                    <div 
                      onClick={(e) => {
                        if (isDraggingRef.current) { e.preventDefault(); return; }
                        handlePlaceholderClick(product);
                      }}
                      style={{ 
                        height: '100%', 
                        border: layoutSize === 'large' ? '2px dashed #3b82f6' : '2px dashed #cbd5e1', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: layoutSize === 'large' ? '#eff6ff' : '#f8fafc',
                        cursor: 'pointer',
                        color: layoutSize === 'large' ? '#1d4ed8' : '#64748b' 
                      }}
                    >
                      <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>Click to Upload</span>
                      <span style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{layoutSize === 'large' ? '2x2 (Large)' : '1x1 (Small)'}</span>
                      
                      {/* Actions */}
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '4px' }}>
                         <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: '#64748b' }}>Resize</button>
                         <button onClick={(e) => { e.stopPropagation(); updateProductInSet(set.id, product.id, { isHidden: true }); }} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: '#64748b' }}>Hide</button>
                      </div>
                    </div>
                  </div>
                );
              }'''

c = c.replace(old_render, new_render)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
