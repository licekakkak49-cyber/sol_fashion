import re

with open('src/context/AdminContext.jsx', 'r') as f:
    code = f.read()

crud_functions = """
  const addHomepageGridItem = async (item) => {
    const newId = crypto.randomUUID();
    const dbItem = {
      id: newId,
      layout_size: item.layoutSize || '1x1',
      content_type: item.contentType || 'placeholder',
      content_data: item.contentData || {},
      grid_index: item.gridIndex || homepageGridItems.length
    };
    
    const { error } = await supabase.from('homepage_grid_items').insert([dbItem]);
    if (!error) {
      setHomepageGridItems(prev => [...prev, {
        id: newId,
        layoutSize: dbItem.layout_size,
        contentType: dbItem.content_type,
        contentData: dbItem.content_data,
        gridIndex: dbItem.grid_index
      }]);
    } else {
      console.error("Error adding grid item:", error);
    }
  };

  const updateHomepageGridItem = async (id, updates) => {
    const dbUpdates = {};
    if (updates.layoutSize !== undefined) dbUpdates.layout_size = updates.layoutSize;
    if (updates.contentType !== undefined) dbUpdates.content_type = updates.contentType;
    if (updates.contentData !== undefined) dbUpdates.content_data = updates.contentData;
    if (updates.gridIndex !== undefined) dbUpdates.grid_index = updates.gridIndex;

    setHomepageGridItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    const { error } = await supabase.from('homepage_grid_items').update(dbUpdates).eq('id', id);
    if (error) console.error("Error updating grid item:", error);
  };

  const deleteHomepageGridItem = async (id) => {
    setHomepageGridItems(prev => prev.filter(item => item.id !== id));
    await supabase.from('homepage_grid_items').delete().eq('id', id);
  };

  const updateGridOrder = async (newItemsOrder) => {
    setHomepageGridItems(newItemsOrder);
    
    // Bulk update positions
    for (let i = 0; i < newItemsOrder.length; i++) {
      await supabase.from('homepage_grid_items').update({ grid_index: i }).eq('id', newItemsOrder[i].id);
    }
  };
"""

code = code.replace("const updateHomepageModule = async (id, updatedFields) => {", crud_functions + "\n  const updateHomepageModule = async (id, updatedFields) => {")

with open('src/context/AdminContext.jsx', 'w') as f:
    f.write(code)
