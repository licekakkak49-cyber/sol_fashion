import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

old_logic = """  const displayCategories = useMemo(() => {
    const contextCats = adminCtx.categories || {};
    if (mainParam === 'New In') {
      return ['View all', 'Bags', 'Ready to Wear', 'Accessories & Shoes'];
    }
    if (mainParam && contextCats[mainParam]) {
      return ['View all', 'New In', ...contextCats[mainParam]];
    }
    return ['View all', 'New In', 'Bags', 'Ready to Wear', 'Accessories & Shoes'];
  }, [mainParam, adminCtx.categories]);"""

new_logic = """  const displayCategories = useMemo(() => {
    const contextCats = adminCtx.categories || {};
    const mainCats = Object.keys(contextCats);
    if (mainParam === 'New In') {
      return ['View all', ...mainCats];
    }
    if (mainParam && contextCats[mainParam]) {
      return ['View all', 'New In', ...contextCats[mainParam]];
    }
    return ['View all', 'New In', ...mainCats];
  }, [mainParam, adminCtx.categories]);"""

c = c.replace(old_logic, new_logic)

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
