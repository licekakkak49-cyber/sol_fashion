import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

# Make the container position relative
old_wrapper = "          <div style={{ margin: '-12px' }}>"
new_wrapper = "          <div style={{ margin: '-12px', position: 'relative' }}>"
content = content.replace(old_wrapper, new_wrapper)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("Fixed position relative!")
