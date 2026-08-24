with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

old_render = """  const renderItems = sortedItems.map(item => {
    return {
      id: item.id,
      layoutSize: (item.layoutSize || item.layout_size),
      contentType: item.content_type,
      contentData: item.content_data || {}
    };
  });"""

new_render = """  const renderItems = sortedItems.map(item => {
    return {
      id: item.id,
      layoutSize: (item.layoutSize || item.layout_size),
      contentType: item.contentType || item.content_type,
      contentData: item.contentData || item.content_data || {}
    };
  });"""

if old_render in content:
    content = content.replace(old_render, new_render)
    with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
        f.write(content)
    print("Fixed!")
else:
    print("Could not find old_render!")
