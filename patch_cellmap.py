import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

# 1. Update useMemo signature
c = c.replace('const { layout, renderItems } = useMemo(() => {', 'const { layout, renderItems, cellMap } = useMemo(() => {\\n    const cellMap = {};')

# 2. Update arrangement loop
old_arrange = '''    // Arrange blocks into layout
    let currentY = 0;
    let blockParity = 0; // 0 = left, 1 = right
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      
      if (block.type === 'wide') {
         block.items.forEach((item, idx) => {
            layout.push({ i: item.id, x: idx, y: currentY, w: 1, h: 1 });
            renderItems.push({ isPlaceholder: item.isPlaceholder, product: item });
         });
         currentY += 1;
         blockParity = 0; // Reset to left for next standard block
      } else {
         const isRightBlock = blockParity === 1;
         const startX = isRightBlock ? 2 : 0;
         
         if (block.items.length === 1 && block.items[0].layoutSize === 'large') {
            layout.push({ i: block.items[0].id, x: startX, y: currentY, w: 2, h: 2 });
            renderItems.push({ isPlaceholder: block.items[0].isPlaceholder, product: block.items[0] });
         } else {
            // small items in 2x2 area
            block.items.forEach((item, idx) => {
               const lx = startX + (idx % 2);
               const ly = currentY + Math.floor(idx / 2);
               layout.push({ i: item.id, x: lx, y: ly, w: 1, h: 1 });
               renderItems.push({ isPlaceholder: item.isPlaceholder, product: item });
            });
         }
         
         if (isRightBlock) {
            currentY += 2;
            blockParity = 0;
         } else {
            blockParity = 1;
         }
      }
    }

    console.log('Generated Layout:', layout);
    return { layout, renderItems };
  }, [setProducts]);'''

new_arrange = '''    // Arrange blocks into layout
    let currentY = 0;
    let blockParity = 0; // 0 = left, 1 = right
    let currentGlobalIndex = 0;
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockStartIndex = currentGlobalIndex;
      
      if (block.type === 'wide') {
         for (let idx = 0; idx < 4; idx++) {
            cellMap[`${idx},${currentY}`] = blockStartIndex + Math.min(idx, block.items.length);
         }
         block.items.forEach((item, idx) => {
            layout.push({ i: item.id, x: idx, y: currentY, w: 1, h: 1 });
            renderItems.push({ isPlaceholder: item.isPlaceholder, product: item });
         });
         currentGlobalIndex += block.items.length;
         currentY += 1;
         blockParity = 0; // Reset to left for next standard block
      } else {
         const isRightBlock = blockParity === 1;
         const startX = isRightBlock ? 2 : 0;
         
         for(let dy=0; dy<2; dy++) {
            for(let dx=0; dx<2; dx++) {
               cellMap[`${startX + dx},${currentY + dy}`] = blockStartIndex + block.items.length;
            }
         }

         if (block.items.length === 1 && block.items[0].layoutSize === 'large') {
            layout.push({ i: block.items[0].id, x: startX, y: currentY, w: 2, h: 2 });
            renderItems.push({ isPlaceholder: block.items[0].isPlaceholder, product: block.items[0] });
         } else {
            // small items in 2x2 area
            block.items.forEach((item, idx) => {
               const lx = startX + (idx % 2);
               const ly = currentY + Math.floor(idx / 2);
               cellMap[`${lx},${ly}`] = blockStartIndex + idx;
               layout.push({ i: item.id, x: lx, y: ly, w: 1, h: 1 });
               renderItems.push({ isPlaceholder: item.isPlaceholder, product: item });
            });
         }
         
         currentGlobalIndex += block.items.length;
         
         if (isRightBlock) {
            currentY += 2;
            blockParity = 0;
         } else {
            blockParity = 1;
         }
      }
    }

    console.log('Generated Layout:', layout);
    return { layout, renderItems, cellMap };
  }, [setProducts]);'''

if old_arrange in c:
    c = c.replace(old_arrange, new_arrange)
else:
    print('Failed to replace arrangement loop')

# 3. Update handleDragStop to use cellMap
old_drag_stop = '''    // If not dropped on another card, just insert at the visual index
    const sorted = [...newRglLayout].sort((a, b) => {
      return (a.y * 4 + a.x) - (b.y * 4 + b.x);
    });
    const newIndex = sorted.findIndex(item => item.i === draggedId);
    if (newIndex !== -1) {
      changeProductOrderInSet(set.id, draggedId, newIndex);
    }'''

new_drag_stop = '''    // If not dropped on another card, use cellMap to find target insertion index
    const draggedItemRgl = newRglLayout.find(item => item.i === draggedId);
    if (draggedItemRgl) {
       const key = `${draggedItemRgl.x},${draggedItemRgl.y}`;
       let newIndex = cellMap[key];
       
       if (newIndex === undefined) {
          newIndex = set.items.length; // Drop out of bounds -> append to end
       }
       
       if (newIndex !== -1) {
          changeProductOrderInSet(set.id, draggedId, newIndex);
       }
    }'''

if old_drag_stop in c:
    c = c.replace(old_drag_stop, new_drag_stop)
else:
    print('Failed to replace drag stop logic')

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)
