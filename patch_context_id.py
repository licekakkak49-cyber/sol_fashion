import re

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'r') as f:
    c = f.read()

c = c.replace('productId: `ph-${Date.now()}-${Math.random()}`', 'productId: `draft-${Date.now()}-${Math.random()}`')

with open('/Users/aliceer/sol_fashion/src/context/AdminContext.jsx', 'w') as f:
    f.write(c)
