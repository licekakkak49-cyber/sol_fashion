import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# Remove the All subcategory button
c = re.sub(r'<button\s+onClick=\{\(\) => setActiveSubCategory\(\'All\'\)\}.*?</button>', '', c, flags=re.DOTALL)

# Default to first subcategory instead of 'All'
c = c.replace("const [activeSubCategory, setActiveSubCategory] = useState('All');", "const [activeSubCategory, setActiveSubCategory] = useState('Tote Bags');")

# Also need to make sure when main category changes, we pick the first subcategory
c = c.replace("onClick={() => { setActiveMainCategory(cat); setActiveSubCategory('All'); }}", "onClick={() => { setActiveMainCategory(cat); setActiveSubCategory(categories[cat]?.[0] || ''); }}")

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
