import re
with open('src/components/GlobalFilterPanel.jsx', 'r') as f:
    code = f.read()

# Replace the dynamic Filter extraction
old_dynamic = """  const dynamicFilterData = React.useMemo(() => {
    const available = { color: new Set(), size: new Set(), category: new Set(), line: new Set() };
    products.forEach(p => {
      if (p.mainCategory) available.category.add(p.mainCategory);
      if (p.subCategory) available.category.add(p.subCategory);
      
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(t => available.line.add(t));
      }
      
      (p.colorVariants || []).forEach(v => {
        if (v.name) available.color.add(v.name);
        if (v.stock) {
          Object.entries(v.stock).forEach(([sz, qty]) => {
            if (qty > 0) available.size.add(sz);
          });
        }
      });
    });

    const result = {
      color: FILTER_DATA.color.filter(c => available.color.has(c)),
      size: FILTER_DATA.size.filter(s => available.size.has(s)),
      category: FILTER_DATA.category.filter(c => available.category.has(c)),
      line: FILTER_DATA.line.filter(l => available.line.has(l))
    };
    
    // Add any items that were not in the master lists
    available.color.forEach(c => { if (!result.color.includes(c)) result.color.push(c); });
    available.size.forEach(s => { if (!result.size.includes(s)) result.size.push(s); });
    available.category.forEach(c => { if (!result.category.includes(c)) result.category.push(c); });
    available.line.forEach(l => { if (!result.line.includes(l)) result.line.push(l); });

    return result;
  }, [products]);"""

new_dynamic = """  const { dynamicFilterData, colorMap } = React.useMemo(() => {
    const available = { color: new Set(), size: new Set(), category: new Set(), line: new Set() };
    const mapOfColors = {};
    
    products.forEach(p => {
      if (p.mainCategory) available.category.add(p.mainCategory);
      if (p.subCategory) available.category.add(p.subCategory);
      
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(t => available.line.add(t));
      }
      
      (p.colorVariants || []).forEach(v => {
        let hasAnyStock = false;
        if (v.stock) {
          Object.entries(v.stock).forEach(([sz, qty]) => {
            if (parseInt(qty) > 0) {
              available.size.add(sz);
              hasAnyStock = true;
            }
          });
        }
        
        // Only show color if it actually has stock
        if (v.name && hasAnyStock) {
          available.color.add(v.name);
          if (!mapOfColors[v.name] && v.hex) {
            mapOfColors[v.name] = v.hex;
          }
        }
      });
    });

    const result = {
      color: FILTER_DATA.color.filter(c => available.color.has(c)),
      size: FILTER_DATA.size.filter(s => available.size.has(s)),
      category: FILTER_DATA.category.filter(c => available.category.has(c)),
      line: FILTER_DATA.line.filter(l => available.line.has(l))
    };
    
    available.color.forEach(c => { if (!result.color.includes(c)) result.color.push(c); });
    available.size.forEach(s => { if (!result.size.includes(s)) result.size.push(s); });
    available.category.forEach(c => { if (!result.category.includes(c)) result.category.push(c); });
    available.line.forEach(l => { if (!result.line.includes(l)) result.line.push(l); });

    return { dynamicFilterData: result, colorMap: mapOfColors };
  }, [products]);"""

code = code.replace(old_dynamic, new_dynamic)

# Replace getDotColor function
old_dot = """  const getDotColor = (colorName) => {
    const map = {
      'Beige': '#e8dec9', 'Black': '#000000', 'Blue': '#1c39bb',
      'Brown': '#5c4033', 'Gold': '#d4af37', 'Green': '#228b22',
      'Grey': '#808080', 'Navy': '#000080', 'Orange': '#ffa500',
      'Pink': '#ffc0cb', 'Red': '#ff0000', 'Silver': '#c0c0c0',
      'White': '#ffffff', 'Yellow': '#ffd700'
    };
    return map[colorName] || colorName.toLowerCase();
  };"""

new_dot = """  const getDotColor = (colorName) => {
    // Return backend hex first, fallback to basic CSS color
    if (colorMap[colorName]) return colorMap[colorName];
    
    // Fallback for defaults if somehow missing
    const fallbackMap = {
      'Beige': '#e8dec9', 'Black': '#000000', 'Blue': '#1c39bb',
      'Brown': '#5c4033', 'Gold': '#d4af37', 'Green': '#228b22',
      'Grey': '#808080', 'Navy': '#000080', 'Orange': '#ffa500',
      'Pink': '#ffc0cb', 'Red': '#ff0000', 'Silver': '#c0c0c0',
      'White': '#ffffff', 'Yellow': '#ffd700'
    };
    return fallbackMap[colorName] || colorName.toLowerCase();
  };"""

code = code.replace(old_dot, new_dot)

with open('src/components/GlobalFilterPanel.jsx', 'w') as f:
    f.write(code)
