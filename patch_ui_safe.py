import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# I need to calculate the rows for rendering UI.
# This should be done right before `return ( <div className={styles.adminPage}> ... )`
ui_logic = """  // Calculate UI rows for Left Space buttons
  const uiRows = [];
  layout.forEach(lItem => {
     let placed = false;
     for (const row of uiRows) {
        if (lItem.y < row.maxY) {
           row.items.push(lItem.i);
           row.maxY = Math.max(row.maxY, lItem.y + lItem.h);
           placed = true;
           break;
        }
     }
     if (!placed) {
        uiRows.push({ id: `row-${lItem.y}`, minY: lItem.y, maxY: lItem.y + lItem.h, items: [lItem.i] });
     }
  });

  uiRows.forEach(row => {
     const firstItem = sortedItems.find(i => i.id === row.items[0]);
     row.isIndented = firstItem?.contentData?.isIndented || false;
  });

  const handleToggleIndent = (row) => {
     const newItems = sortedItems.map(item => {
        if (row.items.includes(item.id)) {
           return {
              ...item,
              contentData: { ...(item.contentData || {}), isIndented: !row.isIndented }
           };
        }
        return item;
     });
     updateGridOrder(newItems);
  };

  return ("""

code = code.replace("  return (", ui_logic, 1)

# Now inject the buttons into the DOM
buttons_html = """          {/* Row Controls */}
          {uiRows.map(row => (
             <div 
               key={row.id}
               style={{
                 position: 'absolute',
                 left: '-140px',
                 top: `${row.minY * rowHeight + row.minY * 12}px`,
                 width: '120px',
                 zIndex: 10,
                 display: 'flex',
                 alignItems: 'flex-start',
                 justifyContent: 'flex-end',
                 paddingTop: '20px'
               }}
             >
                <button
                   onClick={() => handleToggleIndent(row)}
                   style={{
                      background: row.isIndented ? '#111' : '#fff',
                      color: row.isIndented ? '#fff' : '#111',
                      border: row.isIndented ? '1px solid #111' : '1px solid #ddd',
                      padding: '6px 12px',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                   }}
                >
                   {row.isIndented ? '→ Indented' : '+ Left Space'}
                </button>
             </div>
          ))}
          <ResponsiveGridLayout"""

code = code.replace("          <ResponsiveGridLayout", buttons_html)

# Add padding to make space for the floating buttons
code = code.replace("<div style={{ margin: '-12px' }}>", "<div style={{ margin: '-12px', position: 'relative', paddingLeft: '140px' }}>")

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
