import re

with open('src/pages/HomePage.module.css', 'r') as f:
    content = f.read()

# Add height: 100dvh; and remove aspect ratio constraint
content = content.replace(
    ".fullWidth {\n  width: 100vw !important;",
    ".fullWidth {\n  width: 100vw !important;\n  height: 100dvh !important;\n"
)

with open('src/pages/HomePage.module.css', 'w') as f:
    f.write(content)

with open('src/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Do not apply inline aspect ratio if it's full width
content = content.replace(
    "aspectRatio: w === 4 && h === 2 ? '3/2' : '3/4',",
    "aspectRatio: displayClass === styles.fullWidth ? undefined : (w === 4 && h === 2 ? '3/2' : '3/4'),"
)

with open('src/pages/HomePage.jsx', 'w') as f:
    f.write(content)

print("Applied full height fix!")
