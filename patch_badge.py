import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

replacement = """                  <div className={styles.productCard}>
                    {item.layoutSize === '4x2' && (
                      <div style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        color: '#fff',
                        backgroundColor: item.contentData?.displayMode === 'full-width' ? '#8b5cf6' : 
                                         item.contentData?.displayMode === 'edge-to-edge' ? '#3b82f6' : '#6b7280',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        {item.contentData?.displayMode === 'full-width' ? '📺 FULL SCREEN' : 
                         item.contentData?.displayMode === 'edge-to-edge' ? '↔ TOUCH EDGES' : 'NORMAL'}
                      </div>
                    )}"""

code = code.replace("                  <div className={styles.productCard}>", replacement)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
