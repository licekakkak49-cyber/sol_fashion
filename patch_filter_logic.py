import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'r') as f:
    c = f.read()

# 1. Insert new state variables
new_state = '''  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // List Mode Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [listFilters, setListFilters] = useState({
    categories: [],
    stockLevels: [], // 'out_of_stock', 'low_stock', 'in_stock'
    statuses: [] // 'active', 'draft'
  });

  const toggleListFilter = (type, value) => {
    setListFilters(prev => {
      const current = prev[type];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const removeListFilter = (type, value) => {
    setListFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(v => v !== value)
    }));
  };'''

c = c.replace("  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'", new_state)

# 2. Update filteredProducts logic
old_filtered = '''  const filteredProducts = useMemo(() => {
    if (!validProducts.length) return [];
    
    const filtered = validProducts.filter(p => {
      // 1. Tab Filter
      const stockNum = parseInt(p.stock) || 0;
      if (activeTab === 'In Stock' && stockNum === 0) return false;
      if (activeTab === 'Low Stock' && (stockNum === 0 || stockNum > 5)) return false;
      if (activeTab === 'Out of Stock' && stockNum > 0) return false;
      
      // 2. Category Filters
      if (activeMainCategory !== 'All' && p.mainCategory !== activeMainCategory) return false;
      if (activeSubCategory !== 'All' && p.subCategory !== activeSubCategory) return false;

      // 3. Dropdown Filters
      if (filterBrand !== 'All' && p.brandId !== filterBrand) return false;
      
      // Fallback gender to Unisex if missing for older mock data
      const pGender = p.gender || 'Unisex';
      if (filterGender !== 'All' && pGender !== filterGender) return false;
      
      const pHighlight = Array.isArray(p.highlight) ? p.highlight : (p.highlight && p.highlight !== 'None' ? [p.highlight] : []);
      if (filterHighlight !== 'All' && !pHighlight.includes(filterHighlight)) return false;
      
      // 4. Search Query
      if (searchQuery) {
        const query = String(searchQuery || '').toLowerCase();
        const safeName = String(p.name || '');
        const safeSku = String(p.sku || '');
        
        const matchName = safeName.toLowerCase().includes(query);
        const matchSku = safeSku.toLowerCase().includes(query);
        if (!matchName && !matchSku) return false;
      }
      
      return true;
    });'''

new_filtered = '''  const filteredProducts = useMemo(() => {
    if (!validProducts.length) return [];
    
    const filtered = validProducts.filter(p => {
      // 1. Search Query (Applies to both modes)
      if (searchQuery) {
        const query = String(searchQuery || '').toLowerCase();
        const safeName = String(p.name || '');
        const safeSku = String(p.sku || '');
        
        const matchName = safeName.toLowerCase().includes(query);
        const matchSku = safeSku.toLowerCase().includes(query);
        if (!matchName && !matchSku) return false;
      }

      const stockNum = parseInt(p.stock) || 0;

      if (viewMode === 'grid') {
        // --- GRID MODE LOGIC ---
        // Tab Filter
        if (activeTab === 'In Stock' && stockNum === 0) return false;
        if (activeTab === 'Low Stock' && (stockNum === 0 || stockNum > 5)) return false;
        if (activeTab === 'Out of Stock' && stockNum > 0) return false;
        
        // Category Filters
        if (activeMainCategory !== 'All' && p.mainCategory !== activeMainCategory) return false;
        if (activeSubCategory !== 'All' && p.subCategory !== activeSubCategory) return false;

        // Dropdown Filters
        if (filterBrand !== 'All' && p.brandId !== filterBrand) return false;
        const pGender = p.gender || 'Unisex';
        if (filterGender !== 'All' && pGender !== filterGender) return false;
        
        const pHighlight = Array.isArray(p.highlight) ? p.highlight : (p.highlight && p.highlight !== 'None' ? [p.highlight] : []);
        if (filterHighlight !== 'All' && !pHighlight.includes(filterHighlight)) return false;
      } else {
        // --- LIST MODE LOGIC (Faceted Filters) ---
        // Categories
        if (listFilters.categories.length > 0) {
          if (!listFilters.categories.includes(p.mainCategory)) return false;
        }
        
        // Stock Levels
        if (listFilters.stockLevels.length > 0) {
          const isOOS = stockNum === 0;
          const isLow = stockNum > 0 && stockNum < 10;
          const isInStock = stockNum >= 10;
          
          let matchesStock = false;
          if (listFilters.stockLevels.includes('out_of_stock') && isOOS) matchesStock = true;
          if (listFilters.stockLevels.includes('low_stock') && isLow) matchesStock = true;
          if (listFilters.stockLevels.includes('in_stock') && isInStock) matchesStock = true;
          
          if (!matchesStock) return false;
        }
        
        // Statuses
        if (listFilters.statuses.length > 0) {
          const pStatus = p.status || 'draft';
          if (!listFilters.statuses.includes(pStatus)) return false;
        }
      }
      
      return true;
    });'''

c = c.replace(old_filtered, new_filtered)

with open('/Users/aliceer/sol_fashion/src/pages/admin/ManageProductsPage.jsx', 'w') as f:
    f.write(c)
