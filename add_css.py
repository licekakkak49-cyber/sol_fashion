import re

with open('src/pages/HomePage.module.css', 'r') as f:
    code = f.read()

# Replace `padding: 12px;` in `.homepageGrid` with `padding: 0 12px;`
code = code.replace("padding: 12px;", "padding: 0 12px;")

wrapper_css = """
.homepageGridWrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
  width: 100%;
}
"""

if ".homepageGridWrapper" not in code:
    code += wrapper_css

with open('src/pages/HomePage.module.css', 'w') as f:
    f.write(code)
