import re

with open('src/pages/HomePage.module.css', 'r') as f:
    code = f.read()

code = code.replace("padding: 0 12px;", "padding: 12px;")

wrapper_css = """
.homepageGridWrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
  width: 100%;
}
"""

code = code.replace(wrapper_css, "")

with open('src/pages/HomePage.module.css', 'w') as f:
    f.write(code)
