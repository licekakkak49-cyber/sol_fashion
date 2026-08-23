import re
with open('src/components/GlobalFilterPanel.jsx', 'r') as f:
    code = f.read()

old_props = "const GlobalFilterPanel = ({ isOpen, selectedFilters, onFilterChange, filteredCount, onClose, removeFilter, onClearAll }) => {"
new_props = "const GlobalFilterPanel = ({ isOpen, selectedFilters, onFilterChange, filteredCount, onClose, removeFilter, onClearAll, products = [] }) => {"
code = code.replace(old_props, new_props)

dynamic_data = """  const [isMobile, setIsMobile] = useState(false);
  
  // Dynamically extract available options from products
  const dynamicFilterData = React.useMemo(() => {
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

code = code.replace("  const [isMobile, setIsMobile] = useState(false);", dynamic_data)

# Replace FILTER_DATA in rendering
code = code.replace("FILTER_DATA[", "dynamicFilterData[")

with open('src/components/GlobalFilterPanel.jsx', 'w') as f:
    f.write(code)
