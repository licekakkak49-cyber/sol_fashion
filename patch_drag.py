import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

new_drag_logic = """
  const handleDragStop = (newRglLayout, oldItem, newItem, placeholder, e, element) => {
    const draggedId = newItem.i;

    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    if (!clientX || !clientY || !element) {
      // Fallback: standard push sorting
      const newLayout = [...newRglLayout].sort((a, b) => {
        if (a.y === b.y) return a.x - b.x;
        return a.y - b.y;
      });
      const reorderedItems = newLayout.map((lItem, index) => {
        const origItem = sortedItems.find(i => i.id === lItem.i);
        return { ...origItem, gridIndex: index };
      });
      updateGridOrder(reorderedItems);
      return;
    }

    // Temporarily hide to find what's underneath
    const originalVisibility = element.style.visibility;
    element.style.visibility = 'hidden';
    const elementsUnder = document.elementsFromPoint(clientX, clientY);
    element.style.visibility = originalVisibility;

    const targetElement = elementsUnder.find(el => el.hasAttribute('data-grid-id') && el.getAttribute('data-grid-id') !== draggedId);

    if (targetElement) {
      // SWAP indexes
      const targetId = targetElement.getAttribute('data-grid-id');
      const newItems = [...sortedItems];
      const indexA = newItems.findIndex(i => i.id === draggedId);
      const indexB = newItems.findIndex(i => i.id === targetId);
      
      if (indexA !== -1 && indexB !== -1) {
        const itemA = { ...newItems[indexA] };
        const itemB = { ...newItems[indexB] };
        
        // Swap their gridIndex
        const tempIndex = itemA.gridIndex;
        itemA.gridIndex = itemB.gridIndex;
        itemB.gridIndex = tempIndex;
        
        newItems[indexA] = itemA;
        newItems[indexB] = itemB;
        
        updateGridOrder(newItems.sort((a, b) => a.gridIndex - b.gridIndex));
      }
    } else {
      // Fallback push logic
      const newLayout = [...newRglLayout].sort((a, b) => {
        if (a.y === b.y) return a.x - b.x;
        return a.y - b.y;
      });
      const reorderedItems = newLayout.map((lItem, index) => {
        const origItem = sortedItems.find(i => i.id === lItem.i);
        return { ...origItem, gridIndex: index };
      });
      updateGridOrder(reorderedItems);
    }
  };
"""

# Replace the old handleDragStop
code = re.sub(r"const handleDragStop = \(layout, oldItem, newItem, placeholder, e, element\) => \{.*?updateGridOrder\(reorderedItems\);\n  \};", new_drag_logic.strip(), code, flags=re.DOTALL)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
