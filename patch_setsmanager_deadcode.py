import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

# Remove addProduct from SetAccordion props
c = re.sub(r'addProduct={addProduct}', '', c)
c = c.replace(", addProduct }) => {", "}) => {")

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

