with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

import re
# Print length of product.image on the card
c = c.replace(
    "<img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />",
    """<img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
       <div style={{position:'absolute', top: 30, background:'rgba(255,0,0,0.8)', color: '#fff', padding: 4, zIndex: 99}}>{product.image ? 'IMG LEN: ' + product.image.length : 'NO IMG'}</div>"""
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

