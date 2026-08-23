import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

logic_to_strip = """    // Calculate logical rows for UI
    const logicalRows = [];
    layout.forEach(lItem => {
       let placed = false;
       for (const row of logicalRows) {
          if (lItem.y < row.maxY) {
             row.items.push(lItem.i);
             row.maxY = Math.max(row.maxY, lItem.y + lItem.h);
             placed = true;
             break;
          }
       }
       if (!placed) {
          logicalRows.push({ id: `row-${lItem.y}`, minY: lItem.y, maxY: lItem.y + lItem.h, items: [lItem.i] });
       }
    });

    logicalRows.forEach(row => {
       const firstItem = sortedItems.find(i => i.id === row.items[0]);
       row.isIndented = firstItem?.contentData?.isIndented || false;
    });

    const handleToggleIndent = (row) => {
       const newItems = sortedItems.map(item => {
          if (row.items.includes(item.id)) {
             return {
                ...item,
                contentData: { ...item.contentData, isIndented: !row.isIndented }
             };
          }
          return item;
       });
       updateGridOrder(newItems);
    };"""

code = code.replace(logic_to_strip, "")

ui_logic = """          {/* Row Controls */}
          {logicalRows.map(row => (
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
          ))}"""

code = code.replace(ui_logic, "")

code = code.replace("paddingLeft: '140px'", "")
code = code.replace("<div style={{ margin: '-12px', position: 'relative' }}>", "<div style={{ margin: '-12px' }}>")

# Also revert `handleLayoutChange` logic
# Let's just find `const logicalRows = [];` inside handleLayoutChange
grouping_logic_in_handleLayoutChange = """      // Calculate logical rows
      const sortedLayout = [...newLayout].sort((a, b) => a.y - b.y || a.x - b.x);
      const logicalRows = [];
      sortedLayout.forEach(lItem => {
         let placed = false;
         for (const row of logicalRows) {
            if (lItem.y < row.maxY) {
               row.items.push(lItem);
               row.maxY = Math.max(row.maxY, lItem.y + lItem.h);
               placed = true;
               break;
            }
         }
         if (!placed) {
            logicalRows.push({ id: `row-${lItem.y}`, minY: lItem.y, maxY: lItem.y + lItem.h, items: [lItem] });
         }
      });
      
      const layoutMap = {};
      logicalRows.forEach(row => {
         row.items.forEach(lItem => {
            layoutMap[lItem.i] = { rowId: row.id, y: lItem.y };
         });
      });

      const reorderedItems = newLayout.map((lItem, index) => {
        const origItem = sortedItems.find(i => i.id === lItem.i);
        const layoutInfo = layoutMap[lItem.i];
        
        let newContentData = { ...origItem.contentData };
        if (layoutInfo) {
           newContentData.logicalRowId = layoutInfo.rowId;
        }

        // Only update if index or size changed
        if (origItem.gridIndex !== index || origItem.layoutSize !== lItem.layoutSize || JSON.stringify(origItem.contentData) !== JSON.stringify(newContentData)) {
          return { ...origItem, gridIndex: index, contentData: newContentData };
        }
        return null;
      }).filter(Boolean);"""

original_reordered_items = """      const reorderedItems = newLayout.map((lItem, index) => {
        const origItem = sortedItems.find(i => i.id === lItem.i);
        // Only update if index or size changed
        if (origItem.gridIndex !== index || origItem.layoutSize !== lItem.layoutSize) {
          return { ...origItem, gridIndex: index };
        }
        return null;
      }).filter(Boolean);"""

code = code.replace(grouping_logic_in_handleLayoutChange, original_reordered_items)

# Finally, clean up double blank lines
code = re.sub(r'\n{3,}', '\n\n', code)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
