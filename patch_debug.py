with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

import re

# We will add a tiny debug div under the image
c = c.replace(
    "<img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />",
    """<img src={product.image} alt={product.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {!product.image && <div style={{position: 'absolute', color: 'red'}}>No Image</div>}"""
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

