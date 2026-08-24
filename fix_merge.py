import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

# Replace the contentData mapping in renderItems
old_mapping = r"contentData: item.contentData || item.content_data || \{\}"
new_mapping = r"contentData: { ...(item.content_data || {}), ...(item.contentData || {}) }"

content = re.sub(old_mapping, new_mapping, content)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("Fixed!")
