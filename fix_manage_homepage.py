import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

# 1. Fix gridIndex sort
old_sort = "const sortedItems = [...homepageGridItems].sort((a, b) => a.grid_index - b.grid_index);"
new_sort = "const sortedItems = [...homepageGridItems].sort((a, b) => a.gridIndex - b.gridIndex);"
content = content.replace(old_sort, new_sort)

# 2. Fix missing content types rendering as null
old_render = """                          <img src={products?.find(p => p.id === item.contentData.productId)?.image || 'https://via.placeholder.com/150'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product Block" draggable={false} />
                        ) : null}"""
new_render = """                          <img src={products?.find(p => p.id === item.contentData.productId)?.image || 'https://via.placeholder.com/150'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product Block" draggable={false} />
                        ) : (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', border: '1px dashed #d1d5db' }}>
                             <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>{item.contentType}</span>
                          </div>
                        )}"""
content = content.replace(old_render, new_render)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("ManageHomepagePage fixed!")
