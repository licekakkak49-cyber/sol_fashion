import re

with open('src/context/AdminContext.jsx', 'r') as f:
    code = f.read()

# Replace state initialization
code = code.replace("const [homepageModules, setHomepageModules] = useState([]);", "const [homepageModules, setHomepageModules] = useState([]);\n  const [homepageGridItems, setHomepageGridItems] = useState([]);")

# Fetch logic in fetchAllData
fetch_logic = """const { data: homeModules } = await supabase.from('homepage_modules').select('*').order('display_order');
        if (homeModules) {
          setHomepageModules(homeModules.map(m => ({
            id: m.id, type: m.type, data: m.data, isVisible: m.is_visible, displayOrder: m.display_order
          })));
        }"""
new_fetch_logic = """const { data: homeModules } = await supabase.from('homepage_modules').select('*').order('display_order');
        if (homeModules) {
          setHomepageModules(homeModules.map(m => ({
            id: m.id, type: m.type, data: m.data, isVisible: m.is_visible, displayOrder: m.display_order
          })));
        }
        
        const { data: gridItems } = await supabase.from('homepage_grid_items').select('*').order('grid_index');
        if (gridItems) {
          setHomepageGridItems(gridItems.map(item => ({
            id: item.id,
            layoutSize: item.layout_size,
            contentType: item.content_type,
            contentData: item.content_data,
            gridIndex: item.grid_index
          })));
        }"""
code = code.replace(fetch_logic, new_fetch_logic)

# Add CRUD functions
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
code = code.replace("const updateHomepageModule = async (id, updates) => {", crud_functions + "\n  const updateHomepageModule = async (id, updates) => {")

# Export variables
code = code.replace("homepageModules,", "homepageModules,\n    homepageGridItems,\n    addHomepageGridItem,\n    updateHomepageGridItem,\n    deleteHomepageGridItem,\n    updateGridOrder,")

with open('src/context/AdminContext.jsx', 'w') as f:
    f.write(code)
