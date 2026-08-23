import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

replacement = """        let w = 1;
        let h = 1;

        if (item.layout_size === '2x2') { w = 2; h = 2; }
        if (item.layout_size === '4x2') { w = 4; h = 2; }"""

code = code.replace("""        let w = 1;

        if (item.layout_size === '2x2') { w = 2; }
        if (item.layout_size === '4x2') { w = 4; isEdgeToEdge = true; }""", replacement)

replacement2 = """            style={{
              gridColumn: `span ${w}`,
              gridRow: `span ${h}`
            }}"""

code = re.sub(r"            style=\{\{\n              gridColumn: `span \$\{w\}`\n            \}\}", replacement2, code)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)

with open('src/pages/HomePage.module.css', 'r') as f:
    css = f.read()

if "grid-auto-flow: dense;" not in css:
    css = css.replace("grid-template-columns: repeat(4, 1fr);", "grid-template-columns: repeat(4, 1fr);\n  grid-auto-flow: dense;")
    
with open('src/pages/HomePage.module.css', 'w') as f:
    f.write(css)
