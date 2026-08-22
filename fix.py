import re
with open('src/pages/ProductDetailPage.jsx', 'r') as f:
    code = f.read()

# Fix desktop map
code = re.sub(
    r'\{availableSizes\.map\(size => \(\s*\{\(\(\) => \{',
    r'{availableSizes.map(size => {\n',
    code, flags=re.MULTILINE
)
code = re.sub(
    r'\n\s*\}\)\(\)\}\n\s*\)\)\}',
    r'\n                  })}',
    code, flags=re.MULTILINE
)

# Fix mobile map
code = re.sub(
    r'\{availableSizes\.map\(\(size\) => \(\s*\{\(\(\) => \{',
    r'{availableSizes.map((size) => {\n',
    code, flags=re.MULTILINE
)
code = re.sub(
    r'\}\)\(\)\}\n\s*\)\)\}',
    r'  })}',
    code, flags=re.MULTILINE
)

with open('src/pages/ProductDetailPage.jsx', 'w') as f:
    f.write(code)
