import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    content = f.read()

# 1. Add padding to the wrapper so the buttons have space
old_wrapper = "          <div style={{ margin: '-12px', position: 'relative' }}>"
new_wrapper = "          <div style={{ margin: '-12px', position: 'relative', paddingLeft: '160px' }}>"
content = content.replace(old_wrapper, new_wrapper)

# 2. Adjust left offset of the buttons to sit inside the padding
old_btn = "                   left: '-200px',"
new_btn = "                   left: '10px',"
content = content.replace(old_btn, new_btn)

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(content)

print("UI fixed!")
