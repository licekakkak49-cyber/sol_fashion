import re
with open('src/components/GlobalFilterPanel.jsx', 'r') as f:
    code = f.read()

# Fix the dynamic data extraction
old_dynamic = """  const dynamicFilterData = React.useMemo(() => {
    const available = { color: new Set(), size: new Set(), category: new Set() };
    products.forEach(p => {
      if (p.mainCategory) available.category.add(p.mainCategory);
      if (p.subCategory) available.category.add(p.subCategory);
      
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
      line: FILTER_DATA.line
    };
    
    // Add any items that were not in the master lists
    available.color.forEach(c => { if (!result.color.includes(c)) result.color.push(c); });
    available.size.forEach(s => { if (!result.size.includes(s)) result.size.push(s); });
    available.category.forEach(c => { if (!result.category.includes(c)) result.category.push(c); });

    return result;
  }, [products]);"""

new_dynamic = """  const dynamicFilterData = React.useMemo(() => {
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

code = code.replace(old_dynamic, new_dynamic)

# Fix the font styling for the active tags
old_tags = """                      <span 
                        key={`${cat}-${val}`} 
                        onClick={() => removeFilter(cat, val)}
                        style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: '#111', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}
                      >"""

new_tags = """                      <span 
                        key={`${cat}-${val}`} 
                        onClick={() => removeFilter(cat, val)}
                        style={{ fontFamily: '"Futura PT", "Helvetica Neue", Arial, sans-serif', fontSize: '12px', fontWeight: 400, letterSpacing: '0.05em', color: 'rgb(30, 30, 30)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}
                      >"""

code = code.replace(old_tags, new_tags)

with open('src/components/GlobalFilterPanel.jsx', 'w') as f:
    f.write(code)
