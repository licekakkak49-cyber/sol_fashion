import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

if 'const [hoveredCardId, setHoveredCardId] = useState(null)' not in c:
    c = c.replace("const [imageWarning, setImageWarning] = useState('');", "const [imageWarning, setImageWarning] = useState('');\n  const [hoveredCardId, setHoveredCardId] = useState(null);")

old_card = '''                  <div 
                    className={`${styles.card} ${isLarge ? styles.largeCard : styles.standardCard}`} 
                    style={{ 
                      padding: '0', 
                      overflow: 'hidden', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'grab',
                      height: '100%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ flex: 1, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 10 }}>
                        <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: '#111', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Resize</button>
                        <button onClick={(e) => { e.stopPropagation(); removeProductFromSet(set.id, product.id); }} style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', color: '#dc2626', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Remove</button>
                      </div>
                    </div>
                    
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'rgb(30, 30, 30)', lineHeight: '1.2' }}>{product.name}</h4>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
                        <button onClick={() => handleEdit(product)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#2563eb', padding: '0', fontSize: '11px', fontWeight: 500, textDecoration: 'underline' }}>
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>'''

new_card = '''                  <div 
                    className={`${styles.card} ${isLarge ? styles.largeCard : styles.standardCard}`} 
                    style={{ 
                      padding: '0', 
                      overflow: 'hidden', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'grab',
                      height: '100%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      position: 'relative'
                    }}
                    onMouseEnter={() => setHoveredCardId(product.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                  >
                    <div style={{ flex: 1, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      {hoveredCardId === product.id && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
                          <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', zIndex: 10 }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={(e) => { e.stopPropagation(); handleToggleSize(product); }} style={{ background: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: '#111', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Resize</button>
                              <button onClick={(e) => { e.stopPropagation(); removeProductFromSet(set.id, product.id); }} style={{ background: '#fee2e2', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: '#dc2626', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Remove</button>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(product); }} style={{ background: '#eff6ff', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', color: '#2563eb', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '100%' }}>
                              Edit Details
                            </button>
                          </div>
                          
                          <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600, textAlign: 'center', padding: '0 16px', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginTop: 'auto', marginBottom: '24px' }}>
                            {product.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>'''

c = c.replace(old_card, new_card)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
