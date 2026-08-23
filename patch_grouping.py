import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# Update updateGridOrder logic
grouping_logic = """    const handleLayoutChange = (newLayout) => {
      if (isReseeding || !items || items.length === 0) return;
      
      // Calculate logical rows
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
      }).filter(Boolean);

      if (reorderedItems.length > 0) {
        updateGridOrder(reorderedItems);
      }
    };"""

code = re.sub(r"    const handleLayoutChange = \(newLayout\) => \{.*?\n      if \(reorderedItems\.length > 0\) \{\n        updateGridOrder\(reorderedItems\);\n      \}\n    \};", grouping_logic.strip(), code, flags=re.DOTALL)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
