import re

with open('src/pages/ProductsPage.jsx', 'r') as f:
    content = f.read()

# Change the default sort from 0 to Oldest First (ascending uploadDate)
old_sort = """    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // Default: no extra sort
    });"""

new_sort = """    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: Oldest First (Ascending) so upload sequence packs correctly into grids (e.g. 4 smalls then 1 large -> 4+1)
      return new Date(a.uploadDate) - new Date(b.uploadDate); 
    });"""

content = content.replace(old_sort, new_sort)

with open('src/pages/ProductsPage.jsx', 'w') as f:
    f.write(content)

print("Sort fixed!")
