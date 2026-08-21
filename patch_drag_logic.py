import re

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'r') as f:
    c = f.read()

old_drag = """  const handleDragStop = (newRglLayout, oldItem, newItem) => {
    const draggedId = newItem.i;
    const sorted = [...newRglLayout].sort((a, b) => {
      return (a.y * 4 + a.x) - (b.y * 4 + b.x);
    });
    
    const newIndex = sorted.findIndex(item => item.i === draggedId);
    if (newIndex !== -1) {
      changeProductOrderInSet(set.id, draggedId, newIndex);
    }
  };"""

new_drag = """  const handleDragStop = (newRglLayout, oldItem, newItem) => {
    const draggedId = newItem.i;
    const targetX = newItem.x;
    const targetY = newItem.y;

    // Find if the drop coordinate falls inside the bounding box of any existing item
    let dropTargetIndex = layout.findIndex(item => 
      targetX >= item.x && targetX < item.x + item.w && 
      targetY >= item.y && targetY < item.y + item.h
    );

    if (dropTargetIndex !== -1) {
      const targetId = layout[dropTargetIndex].i;
      
      if (targetId !== draggedId) {
        // SWAP in set.items
        const newItems = [...set.items];
        const indexA = newItems.findIndex(i => i.productId === draggedId);
        const indexB = newItems.findIndex(i => i.productId === targetId);
        
        if (indexA !== -1 && indexB !== -1) {
          const tempLayoutSize = newItems[indexA].layoutSize;
          
          // Swap positions
          const tempProduct = newItems[indexA];
          newItems[indexA] = newItems[indexB];
          newItems[indexB] = tempProduct;
          
          // Swap sizes back to maintain slot shape
          newItems[indexA].layoutSize = newItems[indexB].layoutSize;
          newItems[indexB].layoutSize = tempLayoutSize;
          
          updateSet(set.id, { items: newItems });
        }
      }
    } else {
      // Fallback: Just reorder if dropped outside (like the very end)
      const sorted = [...newRglLayout].sort((a, b) => {
        return (a.y * 4 + a.x) - (b.y * 4 + b.x);
      });
      const newIndex = sorted.findIndex(item => item.i === draggedId);
      if (newIndex !== -1) {
        changeProductOrderInSet(set.id, draggedId, newIndex);
      }
    }
  };"""

c = c.replace(old_drag, new_drag)

with open('/Users/aliceer/sol_fashion/src/pages/admin/components/SetsManager.jsx', 'w') as f:
    f.write(c)

