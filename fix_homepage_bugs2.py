import re

with open('src/pages/HomePage.module.css', 'r') as f:
    content = f.read()

# 1. Remove overflow-x: hidden from .homepageGrid to allow FullWidth to break out!
content = content.replace("  overflow-x: hidden;\n", "")

# 2. Change padding: var(--page-padding) 0; to padding: 0 0 var(--page-padding) 0; in homepageGridWrapper
content = content.replace("  padding: var(--page-padding) 0;", "  padding: 0 0 var(--page-padding) 0;")
content = content.replace("    padding: 10px 0;", "    padding: 0 0 10px 0;")

with open('src/pages/HomePage.module.css', 'w') as f:
    f.write(content)

print("CSS fixes applied!")
