with open('/Users/aliceer/sol_fashion/src/pages/admin/components/ProductEditorDrawer.jsx', 'r') as f:
    c = f.read()

import re
c = re.sub(
    r"id: initialData\?\.isPlaceholder \? `new-\$\{Date\.now\(\)\}` : initialData\?\.id",
    "id: initialData?.id",
    c
)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/ProductEditorDrawer.jsx', 'w') as f:
    f.write(c)
