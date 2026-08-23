import re

with open('src/App.jsx', 'r') as f:
    code = f.read()

# Find line 38 and inject isCheckoutPage
old_line = "  const isMinimalFooterPage = isHomePage || location.pathname === '/experience' || location.pathname.startsWith('/experience/') || location.pathname === '/products' || location.pathname.startsWith('/product/') || location.pathname.startsWith('/brand/') || location.pathname === '/story' || location.pathname === '/account' || location.pathname === '/store';"
new_line = old_line + "\n  const isCheckoutPage = location.pathname === '/checkout';"

code = code.replace(old_line, new_line)

with open('src/App.jsx', 'w') as f:
    f.write(code)
