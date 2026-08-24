import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

replacement = """  const handleSaveBlock = async (updatedData) => {
    if (editorConfig.item) {
      await updateHomepageGridItem(editorConfig.item.id, {
        contentType: updatedData.contentType,
        contentData: updatedData.contentData
      });
    }
  };"""

code = code.replace("""  const handleSaveBlock = async (updatedData) => {
    if (editorConfig.item) {
      await updateHomepageGridItem(editorConfig.item.id, {
        content_type: updatedData.contentType,
        content_data: updatedData.contentData
      });
    }
  };""", replacement)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
