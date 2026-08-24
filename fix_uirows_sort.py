import re

with open('src/pages/admin/ManageHomepagePage.jsx', 'r') as f:
    code = f.read()

# Replace `layout.forEach(lItem => {` with `[...layout].sort((a, b) => a.y - b.y || a.x - b.x).forEach(lItem => {`
code = code.replace("layout.forEach(lItem => {", "[...layout].sort((a, b) => a.y - b.y || a.x - b.x).forEach(lItem => {")

with open('src/pages/admin/ManageHomepagePage.jsx', 'w') as f:
    f.write(code)
