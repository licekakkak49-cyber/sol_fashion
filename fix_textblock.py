import re

with open('src/components/HomepageBlocks/TextBlock.jsx', 'r') as f:
    content = f.read()

# Fix padding to be small and consistent
content = content.replace("padding: isPreview ? '0' : '72px 0px',", "padding: '16px 0px',")

# Fix fonts to use Futura PT
content = content.replace("fontFamily: 'var(--font-sans)',", "fontFamily: \"'Futura PT', 'Helvetica Neue', Arial, sans-serif\",")
content = content.replace("fontSize: '11px',", "fontSize: '11px', fontFamily: \"'Futura PT', 'Helvetica Neue', Arial, sans-serif\",")

with open('src/components/HomepageBlocks/TextBlock.jsx', 'w') as f:
    f.write(content)

print("TextBlock fixed!")
