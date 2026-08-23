import re

with open('src/pages/HomePage.jsx', 'r') as f:
    code = f.read()

# Replace the explicit gridColumn and gridRow with just span
# CSS grid handles auto-placement based on the DOM order (which we sorted by Y then X)
code = code.replace(
    "gridColumn: `${layout.x + 1} / span ${layout.w}`,\n              gridRow: `${layout.y + 1} / span ${layout.h}`",
    "gridColumn: `span ${layout.w}`"
)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(code)
