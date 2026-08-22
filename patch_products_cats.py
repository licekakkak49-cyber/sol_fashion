import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Remove hardcoded CATEGORIES
old_cats_arr = """const CATEGORIES = [
  'View all', 'New In', 'SOL Fall 2026', 
  'Bags', 'Dresses', 'Tops', 'Bottoms', 'Accessories'
];"""

c = c.replace(old_cats_arr, "")

# 2. Extract categories from context and define displayCategories
old_state = """  const products = adminCtx.products;
  const sets = previewSets || adminCtx.sets;
  const loading = adminCtx.loading;"""

new_state = """  const products = adminCtx.products;
  const sets = previewSets || adminCtx.sets;
  const loading = adminCtx.loading;
  const categories = adminCtx.categories || {};
  const displayCategories = ['View all', 'New In', ...Object.keys(categories)];"""

c = c.replace(old_state, new_state)

# 3. Replace CATEGORIES.map with displayCategories.map
c = c.replace("{CATEGORIES.map((cat) => (", "{displayCategories.map((cat) => (")

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
