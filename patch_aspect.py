import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

replacement2 = """            style={{
              gridColumn: `span ${w}`,
              gridRow: `span ${h}`,
              aspectRatio: w === 4 && h === 2 ? '3/2' : '3/4'
            }}"""

code = code.replace("""            style={{
              gridColumn: `span ${w}`,
              gridRow: `span ${h}`
            }}""", replacement2)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)
