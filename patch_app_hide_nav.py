import re

with open('src/App.jsx', 'r') as f:
    code = f.read()

# Find where we determine isHomePage etc.
# Check what route booleans exist:
# const isHomePage = location.pathname === '/';
# const isMinimalFooterPage = location.pathname.startsWith('/product');

old_route_checks = "const isMinimalFooterPage = location.pathname.startsWith('/product');"
new_route_checks = """const isMinimalFooterPage = location.pathname.startsWith('/product');
  const isCheckoutPage = location.pathname === '/checkout';"""

if "const isCheckoutPage" not in code:
    code = code.replace(old_route_checks, new_route_checks)

# Now hide Nav and Footer
old_nav = "<Nav isHomePage={isHomePage} onOpenLogin={() => setIsLoginOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} />"
new_nav = "{!isCheckoutPage && <Nav isHomePage={isHomePage} onOpenLogin={() => setIsLoginOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} />}"
code = code.replace(old_nav, new_nav)

old_footer = "{isMinimalFooterPage ? <MinimalFooter /> : <Footer />}"
new_footer = "{!isCheckoutPage && (isMinimalFooterPage ? <MinimalFooter /> : <Footer />)}"
code = code.replace(old_footer, new_footer)

with open('src/App.jsx', 'w') as f:
    f.write(code)
