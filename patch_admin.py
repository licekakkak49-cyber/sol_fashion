import re

with open('src/context/AdminContext.jsx', 'r') as f:
    code = f.read()

new_logic = """  const updateGridOrder = async (newItemsOrder) => {
    setHomepageGridItems(newItemsOrder);
    
    // Bulk update positions and layout_size
    for (let i = 0; i < newItemsOrder.length; i++) {
      await supabase.from('homepage_grid_items').update({ 
        grid_index: i,
        layout_size: newItemsOrder[i].layoutSize 
      }).eq('id', newItemsOrder[i].id);
    }
  };"""

code = re.sub(r"const updateGridOrder = async \(newItemsOrder\) => \{.*?  \};", new_logic.strip(), code, flags=re.DOTALL)

with open('src/context/AdminContext.jsx', 'w') as f:
    f.write(code)
