import re
with open('src/pages/admin/components/InventoryList.jsx', 'r') as f:
    code = f.read()

# Add a badge for the Main Color next to the Product name.
old_name = """                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontWeight: 500, color: '#111', fontSize: '14px' }}>{product.name || 'Unnamed Product'}</div>
                        {hasMissing && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}><AlertCircle size={10} /> Missing Sizes</div>}
                      </div>"""

new_name = """                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontWeight: 500, color: '#111', fontSize: '14px' }}>{product.name || 'Unnamed Product'}</div>
                        {(() => {
                          const mainV = (product.colorVariants || []).find(v => v.isMain);
                          if (mainV) return <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f3f4f6', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: mainV.hex || '#000' }} /> {mainV.name || 'Original'}</div>;
                          return null;
                        })()}
                        {hasMissing && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}><AlertCircle size={10} /> Missing Sizes</div>}
                      </div>"""

code = code.replace(old_name, new_name)

# Make the stock calculation in handleFastUpdate properly update Supabase
# I already wrote this earlier in patch_fast_update.py:
#       const dbPayload = {
#        stock: payload.stock,
#        status: payload.status,
#        color_variants: payload.colorVariants
#      };

with open('src/pages/admin/components/InventoryList.jsx', 'w') as f:
    f.write(code)
