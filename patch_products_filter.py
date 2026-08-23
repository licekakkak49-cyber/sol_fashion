import re
with open('src/pages/ProductsPage.jsx', 'r') as f:
    code = f.read()

old_filter_logic = """      // 2. Sidebar Filters
      for (const [category, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          if (!values.includes(product[category])) {
            return false;
          }
        }
      }"""

new_filter_logic = """      // 2. Sidebar Filters
      for (const [category, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          if (category === 'size') {
            const hasSize = (product.colorVariants || []).some(v => 
              v.stock && Object.entries(v.stock).some(([sz, qty]) => values.includes(sz) && parseInt(qty) > 0)
            );
            if (!hasSize) return false;
          } else if (category === 'color') {
            const hasColor = (product.colorVariants || []).some(v => values.includes(v.name));
            if (!hasColor) return false;
          } else if (category === 'category') {
            if (!values.includes(product.mainCategory) && !values.includes(product.subCategory)) return false;
          } else {
            // fallback
            if (!values.includes(product[category])) return false;
          }
        }
      }"""

code = code.replace(old_filter_logic, new_filter_logic)

with open('src/pages/ProductsPage.jsx', 'w') as f:
    f.write(code)
