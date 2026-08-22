import re

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'r') as f:
    c = f.read()

c = c.replace(">Accessories<", ">Accessories & Shoes<")

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'w') as f:
    f.write(c)
