import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

code = re.sub(r'\s*<button className=\{styles\.closeBtn\}.*?</button>', '', code, flags=re.DOTALL)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
