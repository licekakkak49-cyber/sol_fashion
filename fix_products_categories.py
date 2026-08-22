import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

# Add CATEGORIES back
old_imports = """import styles from './ProductsPage.module.css';



const ProductsPage = ({ previewSets = null }) => {"""
new_imports = """import styles from './ProductsPage.module.css';

const CATEGORIES = [
  'View all', 'New In', 'SOL Fall 2026', 
  'Bags', 'Ready-to-Wear', 'Knit Top', 'Shirt', 'Blouse', 'Shorts', 'Pants', 'Skirt', 'Mini Dress', 'Maxi Dress', 'Sets', 'Accessories & Shoes'
];

const ProductsPage = ({ previewSets = null }) => {"""

c = c.replace(old_imports, new_imports)

# Remove displayCategories logic
c = c.replace("  const categories = adminCtx.categories || {};\n  const displayCategories = ['View all', 'New In', ...Object.keys(categories)];", "")

# Change displayCategories.map to CATEGORIES.map
c = c.replace("{displayCategories.map((cat) => (", "{CATEGORIES.map((cat) => (")

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
