import re

with open('src/pages/HomePage.module.css', 'r') as f:
    content = f.read()

# Remove max-width and margin: 0 auto from .homepageGrid
old_css = """  padding: 0 var(--page-padding);
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}"""

new_css = """  padding: 0 var(--page-padding);
  width: 100%;
}"""

content = content.replace(old_css, new_css)

with open('src/pages/HomePage.module.css', 'w') as f:
    f.write(content)

print("HomePage CSS fixed!")
