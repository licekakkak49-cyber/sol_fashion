import re

with open('src/context/AdminContext.jsx', 'r') as f:
    code = f.read()

replacement = """  const updateGridOrder = async (newItemsOrder) => {
    setHomepageGridItems(newItemsOrder);
    
    // Bulk update positions, layout_size, and content_data
    for (let i = 0; i < newItemsOrder.length; i++) {
      await supabase.from('homepage_grid_items').update({ 
        grid_index: i,
        layout_size: newItemsOrder[i].layoutSize,
        content_data: newItemsOrder[i].contentData
      }).eq('id', newItemsOrder[i].id);
    }
  };"""

original = """  const updateGridOrder = async (newItemsOrder) => {
    setHomepageGridItems(newItemsOrder);
    
    // Bulk update positions and layout_size
    for (let i = 0; i < newItemsOrder.length; i++) {
      await supabase.from('homepage_grid_items').update({ 
        grid_index: i,
        layout_size: newItemsOrder[i].layoutSize 
      }).eq('id', newItemsOrder[i].id);
    }
  };"""

code = code.replace(original, replacement)

with open('src/context/AdminContext.jsx', 'w') as f:
    f.write(code)
