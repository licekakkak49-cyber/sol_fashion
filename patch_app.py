import re

with open('src/App.jsx', 'r') as f:
    code = f.read()

# Add import if needed
if "import CheckoutPage from './pages/CheckoutPage';" not in code:
    code = code.replace("import StorePage from './pages/StorePage';", "import StorePage from './pages/StorePage';\nimport CheckoutPage from './pages/CheckoutPage';")

# Add Route
old_routes = """          <Route path="/account" element={<AccountPage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>"""

new_routes = """          <Route path="/account" element={<AccountPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>"""

code = code.replace(old_routes, new_routes)

with open('src/App.jsx', 'w') as f:
    f.write(code)
