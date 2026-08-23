import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

code = code.replace("marginTop: '16px'", "marginTop: '8px'")

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
