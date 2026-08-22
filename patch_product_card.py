import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old = r"              return \(\n                <div key=\{product.id\}.*?<\/div>\n                <\/div>\n              \);\n            \}\)\}"

new = """              return (
                <div key={product.id} data-grid-id={product.id}>
                  <div className={styles.productCard}>
                    <img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {!product.image && <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'red'}}>No Image</div>}
                    
                    <div className={styles.productOverlay}>
                      <div className={styles.overlayActions}>
                        <button 
                          className={styles.overlayActionBtn}
                          onClick={(e) => { e.stopPropagation(); handleEdit(product, set.id); }}
                          title="Edit Product"
                        >
                          <Edit2 size={14} className={styles.overlayEditBtn} />
                        </button>
                        <button 
                          className={styles.overlayActionBtn}
                          onClick={(e) => { e.stopPropagation(); removeProductFromSet(set.id, product.id); }}
                          title="Remove from Set"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className={styles.overlayInfo}>
                        <h4>{product.name}</h4>
                        <p>${product.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}"""

c = re.sub(old, new, c, flags=re.DOTALL)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
