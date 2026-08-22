import re

with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Patch filteredProducts
old_filter = """  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      // 1. Navigation & Category Pill Filtering
      if (mainParam && mainParam !== 'New In' && mainParam !== 'Explore') {
        if (product.mainCategory !== mainParam) return false;
      }
      if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
        if (product.subCategory !== activeCategory) return false;
      }"""

new_filter = """  const filteredProducts = useMemo(() => {
    return (products || []).filter(product => {
      // 1. Navigation & Category Pill Filtering
      if (mainParam === 'New In' || activeCategory === 'New In') {
        const hasNew = product.tags && (product.tags.includes('new') || product.tags.includes('New In'));
        if (!hasNew) return false;
      } else if (mainParam && mainParam !== 'Explore') {
        if (product.mainCategory !== mainParam) return false;
      }
      
      if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
        if (product.subCategory !== activeCategory) return false;
      }"""

c = c.replace(old_filter, new_filter)


# 2. Patch activeSets
old_active_sets = """    const activeSets = (sets || []).filter(s => {
       // 1. Navigation & Category Pill Filtering
       if (!previewSets) {
         if (mainParam && mainParam !== 'New In' && mainParam !== 'Explore') {
           if (s.mainCategory !== mainParam) return false;
         }
         if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
           if (s.subCategory !== activeCategory) return false;
         }
       }"""

new_active_sets = """    const activeSets = (sets || []).filter(s => {
       // 1. Navigation & Category Pill Filtering
       if (!previewSets) {
         if (mainParam === 'New In' || activeCategory === 'New In') {
            const hasNewProd = (s.items || []).some(setItem => {
               const p = (products || []).find(prod => prod.id === setItem.productId);
               return p && p.tags && (p.tags.includes('new') || p.tags.includes('New In'));
            });
            if (!hasNewProd) return false;
         } else if (mainParam && mainParam !== 'Explore') {
           if (s.mainCategory !== mainParam) return false;
         }
         
         if (activeCategory && activeCategory !== 'View all' && activeCategory !== 'New In') {
           if (s.subCategory !== activeCategory) return false;
         }
       }"""

c = c.replace(old_active_sets, new_active_sets)


# 3. Patch groups item lookup to use products instead of filteredProducts
old_set_items = """    activeSets.forEach(set => {
       const setItems = (set.items || []).map(setItem => {
          const product = filteredProducts.find(p => p.id === setItem.productId);"""

new_set_items = """    activeSets.forEach(set => {
       const setItems = (set.items || []).map(setItem => {
          // Look up in ALL products to ensure we show the WHOLE set, even if some parts aren't "New"
          const product = (products || []).find(p => p.id === setItem.productId);"""

c = c.replace(old_set_items, new_set_items)


# 4. Patch getCategoryCount
old_count = """  const getCategoryCount = (cat) => {
    if (cat === 'View all') return products?.length || 0;
    const mockCounts = {
      'New In': 24,
      'SOL Fall 2026': 42,
      'Bags': 18,
      'Dresses': 12,
      'Tops': 20,
      'Bottoms': 15,
      'Shoes': 14,
      'Accessories': 28
    };
    return mockCounts[cat] || Math.floor(Math.random() * 20) + 1;
  };"""

new_count = """  const getCategoryCount = (cat) => {
    if (cat === 'View all') {
      if (mainParam === 'New In') {
         return (products || []).filter(p => p.tags && (p.tags.includes('new') || p.tags.includes('New In'))).length;
      } else if (mainParam && mainParam !== 'Explore') {
         return (products || []).filter(p => p.mainCategory === mainParam).length;
      }
      return products?.length || 0;
    }
    
    if (cat === 'New In') {
       return (products || []).filter(p => p.tags && (p.tags.includes('new') || p.tags.includes('New In'))).length;
    }
    
    return (products || []).filter(p => p.mainCategory === mainParam && p.subCategory === cat).length;
  };"""

c = c.replace(old_count, new_count)


with open('/Users/aliceer/sol_fashion/src/pages/ProductsPage.jsx', 'w') as f:
    f.write(c)
