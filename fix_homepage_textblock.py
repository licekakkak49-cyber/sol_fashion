import re

with open('src/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Add 4x1 support
content = content.replace(
    "if (item.layout_size === '4x2') { w = 4; h = 2; }",
    "if (item.layout_size === '4x2') { w = 4; h = 2; }\n              if (item.layout_size === '4x1') { w = 4; h = 1; }"
)

# Fix aspect ratio logic to skip text and spacer
content = content.replace(
    "aspectRatio: displayClass === styles.fullWidth ? undefined : (w === 4 && h === 2 ? '3/2' : '3/4'),",
    "aspectRatio: (displayClass === styles.fullWidth || item.content_type === 'text' || item.content_type === 'spacer') ? undefined : (w === 4 && h === 2 ? '3/2' : '3/4'),"
)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("HomePage logic fixed!")
