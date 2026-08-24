import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

grouping_logic = """      const reorderedItems = newLayout.map((lItem, index) => {
        const origItem = sortedItems.find(i => i.id === lItem.i);
        if (!origItem) return null;

        // SAFELY CALCULATE LOGICAL ROW
        // We know newLayout is the exact coordinates.
        // Let's find all items that overlap horizontally with this item's Y space
        const sortedLayout = [...newLayout].sort((a, b) => a.y - b.y || a.x - b.x);
        
        let logicalRowId = `row-${lItem.y}`;
        const logicalRows = [];
        sortedLayout.forEach(loc => {
           let placed = false;
           for (const row of logicalRows) {
              if (loc.y < row.maxY) {
                 row.items.push(loc);
                 row.maxY = Math.max(row.maxY, loc.y + loc.h);
                 placed = true;
                 break;
              }
           }
           if (!placed) {
              logicalRows.push({ id: `row-${loc.y}`, minY: loc.y, maxY: loc.y + loc.h, items: [loc] });
           }
        });
        
        const myRow = logicalRows.find(r => r.items.some(i => i.i === lItem.i));
        if (myRow) logicalRowId = myRow.id;

        const newContentData = { ...origItem.contentData, logicalRowId };
        
        const lSize = origItem.layoutSize || origItem.layout_size;

        if (origItem.gridIndex !== index || lSize !== lItem.layoutSize || JSON.stringify(origItem.contentData) !== JSON.stringify(newContentData)) {
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

code = code.replace(original_reordered_items, grouping_logic)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
