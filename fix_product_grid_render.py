import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

# Add products to useAdmin
content = content.replace(
    "const { homepageGridItems, addHomepageGridItem, updateHomepageGridItem, deleteHomepageGridItem, updateGridOrder } = useAdmin();",
    "const { homepageGridItems, addHomepageGridItem, updateHomepageGridItem, deleteHomepageGridItem, updateGridOrder, products } = useAdmin();"
)

# Add product rendering
old_render = """                        ) : item.contentType === 'image' && item.contentData?.imageUrl ? (
                          <img src={item.contentData.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Block" draggable={false} />
                        ) : null}"""

new_render = """                        ) : item.contentType === 'image' && item.contentData?.imageUrl ? (
                          <img src={item.contentData.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Block" draggable={false} />
                        ) : item.contentType === 'product' && item.contentData?.productId ? (
                          <img src={products?.find(p => p.id === item.contentData.productId)?.image || 'https://via.placeholder.com/150'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Product Block" draggable={false} />
                        ) : null}"""

content = content.replace(old_render, new_render)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("Fixed ManageHomepagePage!")
