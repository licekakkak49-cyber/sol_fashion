import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

correct_block = """
              if (product.isPlaceholder) {
                return (
                  <div key={product.id}>
                    <div 
                      className={`${styles.card} ${isLarge ? styles.largeCard : (layoutSize === 'wide' ? styles.wideCard : styles.standardCard)}`}
                      style={{ 
                        padding: '0', 
                        overflow: 'hidden', 
                        display: 'flex', 
                        flexDirection: 'column',
                        cursor: 'pointer',
                        height: '100%',
                        border: '2px dashed #e2e8f0',
                        background: '#f8fafc',
                        position: 'relative'
                      }}
                      onClick={() => handlePlaceholderClick(product)}
                    >
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{
                           width: '48px', height: '48px',
                           borderRadius: '50%', background: '#fff',
                           boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           color: '#cbd5e1'
                        }}>
                          <Plus size={24} />
                        </div>
                      </div>
                      <div style={{ padding: '12px', textAlign: 'center', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Click to add product</span>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{layoutSize === 'large' ? '2x2 (Large)' : (layoutSize === 'wide' ? '1x4 (Wide)' : '1x1 (Small)')}</div>
                      </div>
                      
                      {/* Actions */}
                      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: '4px' }}>
                         <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: '#64748b' }}>Resize</button>
                         <button onClick={(e) => { e.stopPropagation(); updateProductInSet(set.id, product.id, { isHidden: true }); }} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: '#64748b' }}>Hide</button>
                      </div>
                    </div>
                  </div>
                );
              }
"""

# Let's find "if (product.isPlaceholder) {" and the following "return (\n                <div key={product.id}>" 
# which starts the REAL product render.
start = c.find("if (product.isPlaceholder) {")
end = c.find("return (\n                <div key={product.id}>\n                  <div \n                    className={`${styles.card}", start)

if start != -1 and end != -1:
    c = c[:start] + correct_block + "\n              " + c[end:]

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

