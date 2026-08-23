import re
with open('src/components/SearchDrawer.jsx', 'r') as f:
    code = f.read()

old_prop = """            <GlobalFilterPanel 
              isOpen={isFilterOpen}
              selectedFilters={selectedFilters}"""

new_prop = """            <GlobalFilterPanel 
              isOpen={isFilterOpen}
              selectedFilters={selectedFilters}
              products={products}"""

code = code.replace(old_prop, new_prop)

# We also need to fix the filter logic in SearchDrawer.jsx
old_filter_logic = """    const filtered = (products || []).filter(product => {
      // Basic search match
      const searchMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!searchMatch) return false;

      // Filter Panel conditions
      for (const [category, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          if (!values.includes(product[category])) {
            return false;
          }
        }
      }
      return true;
    });"""

new_filter_logic = """    const filtered = (products || []).filter(product => {
      // Basic search match
      const searchMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!searchMatch) return false;

      // Filter Panel conditions
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
            if (!values.includes(product[category])) return false;
          }
        }
      }
      return true;
    });"""

code = code.replace(old_filter_logic, new_filter_logic)

with open('src/components/SearchDrawer.jsx', 'w') as f:
    f.write(code)
