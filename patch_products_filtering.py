import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

old_filteredProducts = """  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      // If a category has selected filters, the product must match at least one of them.
      for (const [category, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          if (!values.includes(product[category])) {
            return false;
          }
        }
      }
      return true;
    });
  }, [selectedFilters, products]);"""

new_filteredProducts = """  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      // 1. Navigation & Category Pill Filtering
      if (mainParam && mainParam !== 'New In' && mainParam !== 'Explore') {
        if (product.mainCategory !== mainParam) return false;
      }
      if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
        if (product.subCategory !== activeCategory) return false;
      }
      
      // 2. Sidebar Filters
      for (const [category, values] of Object.entries(selectedFilters)) {
        if (values.length > 0) {
          if (!values.includes(product[category])) {
            return false;
          }
        }
      }
      return true;
    });
  }, [selectedFilters, products, mainParam, activeCategory]);"""

c = c.replace(old_filteredProducts, new_filteredProducts)

old_activeSets = """    const activeSets = (sets || []).filter(s => {
       if (previewSets) return true;
       if (s.status === 'published') return true;
       if (s.status === 'scheduled' && s.scheduledDate) {
          return new Date(s.scheduledDate) <= now;
       }
       return false;
    });"""

new_activeSets = """    const activeSets = (sets || []).filter(s => {
       // 1. Navigation & Category Pill Filtering
       if (!previewSets) {
         if (mainParam && mainParam !== 'New In' && mainParam !== 'Explore') {
           if (s.mainCategory !== mainParam) return false;
         }
         if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
           if (s.subCategory !== activeCategory) return false;
         }
       }
       
       // 2. Status check
       if (previewSets) return true;
       if (s.status === 'published') return true;
       if (s.status === 'scheduled' && s.scheduledDate) {
          return new Date(s.scheduledDate) <= now;
       }
       return false;
    });"""

c = c.replace(old_activeSets, new_activeSets)

# Also update dependency array for displayGroups
c = c.replace("}, [filteredProducts, sets, visibleCount]);", "}, [filteredProducts, sets, visibleCount, previewSets, mainParam, activeCategory]);")

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
