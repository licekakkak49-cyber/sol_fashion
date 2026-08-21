import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old_hidden = '''              if (item.isHidden) {
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
              }'''

new_hidden = '''              if (item.isHidden) {
                return (
                  <div key={product.id}>
                    <div 
                      onClick={(e) => {
                        if (isDraggingRef.current) { e.preventDefault(); return; }
                        updateProductInSet(set.id, product.id, { isHidden: false });
                      }}
                      style={{ 
                        height: '100%', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                         width: '48px',
                         height: '48px',
                         borderRadius: '50%',
                         background: '#fff',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: '#64748b',
                         border: '1px solid #e2e8f0',
                         transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Plus size={24} />
                      </div>
                    </div>
                  </div>
                );
              }'''

c = c.replace(old_hidden, new_hidden)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
