import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

replacement = """  const handleBlockClick = (item) => {
    setEditorConfig({
      isOpen: true,
      item: {
        id: item.id,
        layoutSize: item.layoutSize || item.layout_size,
        contentType: item.contentType || item.content_type,
        contentData: item.contentData || item.content_data || {}
      }
    });
  };"""

code = re.sub(r"  const handleBlockClick = \(item\) => \{.*?\n  \};", replacement.strip(), code, flags=re.DOTALL)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
