with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

import re

old_chunk_pattern = re.compile(
    r'<div key=\{item\.id\} data-grid-id=\{item\.id\}>\s*<div\s*style=\{\{.*?</button>\s*</div>\s*</div>', 
    re.DOTALL
)

new_chunk = """<div key={item.id} data-grid-id={item.id}>
                    {isPlaceholder ? (
                      <div 
                        className={styles.ghostSlot} 
                        onClick={() => handleBlockClick(item)}
                      >
                        <Plus className={styles.ghostSlotIcon} size={32} style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '12px', fontWeight: 500, marginTop: '4px', textAlign: 'center' }}>
                          {item.layoutSize === '4x2' ? '4x2 (Hero/Banner)' : 
                           item.layoutSize === '4x1' && item.contentType === 'text' ? '4x1 (Text)' :
                           item.layoutSize === '4x1' && item.contentType === 'spacer' ? '4x1 (Space)' :
                           item.layoutSize === '2x2' ? '2x2 (Large)' : '1x1 (Small)'}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.productCard} style={item.contentType === 'text' ? { border: '1px solid #e5e7eb' } : {}}>
                        {item.contentType === 'spacer' ? (
                           <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)' }}>
                             <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Empty Vertical Space</span>
                           </div>
                        ) : item.contentType === 'text' ? (
                          <div style={{ pointerEvents: 'none', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                             <TextBlock data={item.contentData} isPreview={true} />
                          </div>
                        ) : item.contentType === 'image' && item.contentData?.imageUrl ? (
                          <img src={item.contentData.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Block" draggable={false} />
                        ) : null}
                        
                        <div className={styles.productOverlay}>
                          <div className={styles.overlayActions}>
                            {item.contentType !== 'spacer' && (
                              <button 
                                className={styles.overlayActionBtn}
                                onClick={(e) => { e.stopPropagation(); handleBlockClick(item); }}
                                title="Edit Block"
                              >
                                <Edit2 size={14} className={styles.overlayEditBtn} />
                              </button>
                            )}
                            <button 
                              className={styles.overlayActionBtn}
                              onClick={(e) => { e.stopPropagation(); deleteHomepageGridItem(item.id); }}
                              title="Delete Block"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>"""

if old_chunk_pattern.search(content):
    content = old_chunk_pattern.sub(new_chunk, content)
    with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
        f.write(content)
    print("Replaced with exact UI match!")
else:
    print("Regex didn't match!")
