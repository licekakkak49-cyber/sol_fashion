import re

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'r') as f:
    c = f.read()

# Add categories to useAdmin destructuring
c = c.replace("const { brands, contentArticles } = useAdmin();", "const { brands, contentArticles, categories = {} } = useAdmin();")

with open('/Users/aliceer/sol_fashion/src/components/Nav.jsx', 'w') as f:
    f.write(c)
