import re

with open('src/context/AdminContext.jsx', 'r') as f:
    code = f.read()

fetch_logic = """
      // Fetch Homepage Grid Items
      const { data: gridData } = await supabase.from('homepage_grid_items').select('*').order('grid_index', { ascending: true });
      if (gridData) {
        setHomepageGridItems(gridData.map(item => ({
          id: item.id,
          layoutSize: item.layout_size,
          contentType: item.content_type,
          contentData: item.content_data || {},
          gridIndex: item.grid_index
        })));
      }

      // 3. Fetch Articles & Modules
"""

code = code.replace("      // 3. Fetch Articles & Modules", fetch_logic)

with open('src/context/AdminContext.jsx', 'w') as f:
    f.write(code)
