import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

new_layout_logic = """  const { layout, renderItems } = useMemo(() => {
    const layout = [];
    const renderItems = [];
    
    // Simple 2D Bin Packing to avoid overlaps
    const occupied = {}; // occupied[`${x},${y}`] = true
    
    const isOccupied = (startX, startY, w, h) => {
      for (let y = startY; y < startY + h; y++) {
        for (let x = startX; x < startX + w; x++) {
          if (occupied[`${x},${y}`]) return true;
        }
      }
      return false;
    };
    
    const markOccupied = (startX, startY, w, h) => {
      for (let y = startY; y < startY + h; y++) {
        for (let x = startX; x < startX + w; x++) {
          occupied[`${x},${y}`] = true;
        }
      }
    };
    
    sortedItems.forEach((item, index) => {
      let w = 1;
      let h = 1;
      
      if (item.layoutSize === '2x2') { w = 2; h = 2; }
      if (item.layoutSize === '4x2') { w = 4; h = 2; }
      
      // Find first available slot
      let placed = false;
      let checkY = 0;
      while (!placed) {
        for (let checkX = 0; checkX <= 4 - w; checkX++) {
          if (!isOccupied(checkX, checkY, w, h)) {
            layout.push({
              i: item.id,
              x: checkX,
              y: checkY,
              w: w,
              h: h,
            });
            markOccupied(checkX, checkY, w, h);
            placed = true;
            break;
          }
        }
        if (!placed) checkY++;
      }
      
      renderItems.push(item);
    });
    
    return { layout, renderItems };
  }, [sortedItems]);"""

code = re.sub(r"  const \{ layout, renderItems \} = useMemo\(\(\) => \{.*?(?=\n  const handleDragStop)", new_layout_logic, code, flags=re.DOTALL)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
