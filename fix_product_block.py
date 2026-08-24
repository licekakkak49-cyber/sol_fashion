import re

with open('src/components/HomepageBlocks/ProductBlock.jsx', 'r') as f:
    content = f.read()

# Remove padding and add overlayMode=true
content = content.replace("<div style={{ padding: '0 8px' }}>", "<div style={{ width: '100%', height: '100%' }}>")

content = content.replace("isLarge={false}", "isLarge={false}\n        overlayMode={true}")

with open('src/components/HomepageBlocks/ProductBlock.jsx', 'w') as f:
    f.write(content)

print("ProductBlock updated!")
