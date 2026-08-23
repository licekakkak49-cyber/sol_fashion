import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# 1. Add width: 100% to main container
code = code.replace("<div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '32px' }}>", "<div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', gap: '32px', width: '100%' }}>")

# 2. Fix the renderer to use the exact inline styles we had before
item_renderer = """                return (
                  <div key={item.id} data-grid-id={item.id}>
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: isPlaceholder ? '#fef3c7' : item.contentType === 'spacer' ? 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f3f4f6 10px, #f3f4f6 20px)' : '#fff',
                        border: '2px dashed #e5e7eb',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => { 
                         e.stopPropagation();
                         if (item.contentType !== 'spacer') {
                             handleBlockClick(item);
                         }
                      }}
                    >
                      {item.contentType === 'spacer' ? (
                         <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <span style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Empty Vertical Space</span>
                         </div>
                      ) : item.contentType === 'text' ? (
                        <div style={{ pointerEvents: 'none', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <TextBlock data={item.contentData} isPreview={true} />
                        </div>
                      ) : item.contentType === 'image' && item.contentData?.imageUrl ? (
                        <img src={item.contentData.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Block" draggable={false} />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                          <span style={{ fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
                            {item.layoutSize === '4x2' ? '4x2 (Hero/Banner)' : 
                             item.layoutSize === '4x1' && item.contentType === 'text' ? '4x1 (Text)' :
                             item.layoutSize === '4x1' && item.contentType === 'spacer' ? '4x1 (Space)' :
                             item.layoutSize === '2x2' ? '2x2 (Large)' : '1x1 (Small)'}
                          </span>
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteHomepageGridItem(item.id); }}
                        style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, zIndex: 10 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );"""

# Replace everything from `return (` to `            </ResponsiveGridLayout>`
code = re.sub(r"                return \(\n                  <div key=\{item\.id\} data-grid-id=\{item\.id\}>.*?                  </div>\n                \);\n              \}\)\}", item_renderer + "\n              })}", code, flags=re.DOTALL)


with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
