import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old_layout = '''                          <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', zIndex: 10 }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: '#111', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Resize</button>
                              <button onClick={(e) => { e.stopPropagation(); removeProductFromSet(set.id, product.id); }} style={{ background: '#fee2e2', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: '#dc2626', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Remove</button>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(product); }} style={{ background: '#eff6ff', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', color: '#2563eb', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '100%' }}>
                              Edit Details
                            </button>
                          </div>'''

new_layout = '''                          <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 10 }}>
                            <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: '#111', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', height: 'fit-content' }}>Resize</button>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <button onClick={(e) => { e.stopPropagation(); removeProductFromSet(set.id, product.id); }} style={{ background: '#fee2e2', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: '#dc2626', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '100%' }}>Remove</button>
                              <button onClick={(e) => { e.stopPropagation(); handleEdit(product); }} style={{ background: '#eff6ff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: '#2563eb', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '100%', textAlign: 'center' }}>Edit</button>
                            </div>
                          </div>'''

c = c.replace(old_layout, new_layout)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
