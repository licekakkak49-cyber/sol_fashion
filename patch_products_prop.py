import re
with open('src/pages/ProductsPage.jsx', 'r') as f:
    code = f.read()

old_prop = """        <GlobalFilterPanel 
          isOpen={isFilterOpen}
          selectedFilters={selectedFilters}"""

new_prop = """        <GlobalFilterPanel 
          isOpen={isFilterOpen}
          selectedFilters={selectedFilters}
          products={products}"""

code = code.replace(old_prop, new_prop)

with open('src/pages/ProductsPage.jsx', 'w') as f:
    f.write(code)
