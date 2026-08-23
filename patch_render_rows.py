import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

render_logic = """    const layout = [];
    sortedItems.forEach((item, index) => {
      let w = 1;
      let h = 4; // 1x1 image is 4 subdivisions tall
      
      if (item.layoutSize === '2x2') { w = 2; h = 8; }
      if (item.layoutSize === '4x2') { w = 4; h = 8; }
      if (item.layoutSize === '4x1') { w = 4; h = 1; } // Text is 1 subdivision tall
      
      // Find first available slot
      let placed = false;
      let checkY = 0;
      while (!placed) {
        for (let checkX = 0; checkX <= 4 - w; checkX++) {
          if (!isOccupied(layout, checkX, checkY, w, h)) {
            layout.push({ i: item.id, x: checkX, y: checkY, w, h });
            placed = true;
            break;
          }
        }
        if (!placed) checkY++;
      }
    });

    // Calculate logical rows for UI
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

    // Check which rows are indented based on the first item in the row
    logicalRows.forEach(row => {
       const firstItem = sortedItems.find(i => i.id === row.items[0]);
       row.isIndented = firstItem?.contentData?.isIndented || false;
    });

    const handleToggleIndent = (row) => {
       const updates = [];
       row.items.forEach(itemId => {
          const item = sortedItems.find(i => i.id === itemId);
          if (item) {
             updates.push({
                ...item,
                contentData: { ...item.contentData, isIndented: !row.isIndented }
             });
          }
       });
       if (updates.length > 0) updateGridOrder(updates);
    };"""

code = re.sub(r"    const layout = \[\];\n    sortedItems\.forEach\(\(item, index\) => \{.*?    \}\);", render_logic.strip(), code, flags=re.DOTALL)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
