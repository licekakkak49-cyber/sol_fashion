import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

replacement = """  const renderItems = sortedItems.map(item => {
    const mapped = {
      id: item.id,
      layoutSize: (item.layoutSize || item.layout_size),
      contentType: item.contentType || item.content_type,
      contentData: item.contentData || item.content_data || {}
    };
    console.log("Render item in ManageHomepagePage:", mapped);
    return mapped;
  });"""

code = code.replace("""  const renderItems = sortedItems.map(item => {
    return {
      id: item.id,
      layoutSize: (item.layoutSize || item.layout_size),
      contentType: item.contentType || item.content_type,
      contentData: item.contentData || item.content_data || {}
    };
  });""", replacement)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
