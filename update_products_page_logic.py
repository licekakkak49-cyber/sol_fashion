import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Imports
c = c.replace("import React, { useState, useMemo } from 'react';", "import React, { useState, useMemo, useEffect } from 'react';\nimport { useLocation } from 'react-router-dom';")

# 2. Remove hardcoded CATEGORIES
c = re.sub(r"const CATEGORIES = \[.*?\];\n\n", "", c, flags=re.DOTALL)

# 3. Add dynamic displayCategories logic
logic_code = """const ProductsPage = ({ previewSets = null }) => {
  const adminCtx = useAdmin();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mainParam = searchParams.get('main');

  const displayCategories = useMemo(() => {
    const contextCats = adminCtx.categories || {};
    if (mainParam === 'New In') {
      return ['View all', 'Bags', 'Ready to Wear', 'Accessories & Shoes'];
    }
    if (mainParam && contextCats[mainParam]) {
      return ['View all', 'New In', ...contextCats[mainParam]];
    }
    return ['View all', 'New In', 'Bags', 'Ready to Wear', 'Accessories & Shoes'];
  }, [mainParam, adminCtx.categories]);

  const products = adminCtx.products;
  const sets = previewSets || adminCtx.sets;
  const loading = adminCtx.loading;

  const [activeCategory, setActiveCategory] = useState('View all');
  
  useEffect(() => {
    setActiveCategory('View all');
  }, [mainParam]);"""

c = c.replace("""const ProductsPage = ({ previewSets = null }) => {
  const adminCtx = useAdmin();
  const products = adminCtx.products;
  const sets = previewSets || adminCtx.sets;
  const loading = adminCtx.loading;

  const [activeCategory, setActiveCategory] = useState('View all');""", logic_code)

# 4. Replace CATEGORIES.map with displayCategories.map
c = c.replace("{CATEGORIES.map((cat) => (", "{displayCategories.map((cat) => (")

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
