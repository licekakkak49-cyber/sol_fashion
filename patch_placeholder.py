with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

import re

old_placeholder = """                    <div 
                      onClick={() => handlePlaceholderClick(product)}
                      style={{ 
                        height: '100%', 
                        border: '2px dashed #cbd5e1', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        color: '#64748b'
                      }}
                    >
                      <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>Click to Upload</span>
                      <span style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{layoutSize === 'large' ? '2x2 (Large)' : '1x1 (Small)'}</span>
                      
                      {/* Drag handle area */}
                      <div style={{ position: 'absolute', top: 8, right: 8 }}>
                         <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer' }}>Resize</button>
                      </div>
                    </div>"""

new_placeholder = """                    <div 
                      style={{ 
                        height: '100%', 
                        border: '2px dashed #cbd5e1', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: '#f8fafc',
                        cursor: 'grab',
                        color: '#64748b',
                        position: 'relative'
                      }}
                    >
                      <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePlaceholderClick(product); }}
                        style={{ 
                          padding: '8px 16px', background: '#111', color: '#fff', border: 'none', 
                          borderRadius: '100px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                          marginBottom: '4px', zIndex: 10 
                        }}
                      >
                        Add Product
                      </button>
                      <span style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{layoutSize === 'large' ? '2x2 (Large)' : '1x1 (Small)'}</span>
                      
                      {/* Drag handle area */}
                      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                         <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer' }}>Resize</button>
                      </div>
                    </div>"""

c = c.replace(old_placeholder, new_placeholder)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

