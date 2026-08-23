import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# Strip out the injected logic
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

# Now insert it BEFORE the main return statement
# The main return is `  return (`

code = code.replace("  return (", logic_to_strip + "\n\n  return (")

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
