import re
with open('src/pages/ProductsPage.jsx', 'r') as f:
    code = f.read()

old_fallback = """          } else if (category === 'category') {
            if (!values.includes(product.mainCategory) && !values.includes(product.subCategory)) return false;
          } else {
            // fallback
            if (!values.includes(product[category])) return false;
          }"""

new_fallback = """          } else if (category === 'category') {
            if (!values.includes(product.mainCategory) && !values.includes(product.subCategory)) return false;
          } else if (category === 'line') {
            const hasLine = (product.tags || []).some(t => values.includes(t));
            if (!hasLine) return false;
          } else {
            // fallback
            if (!values.includes(product[category])) return false;
          }"""

code = code.replace(old_fallback, new_fallback)
with open('src/pages/ProductsPage.jsx', 'w') as f:
    f.write(code)

with open('src/components/SearchDrawer.jsx', 'r') as f:
    code2 = f.read()
code2 = code2.replace(old_fallback, new_fallback)
with open('src/components/SearchDrawer.jsx', 'w') as f:
    f.write(code2)
