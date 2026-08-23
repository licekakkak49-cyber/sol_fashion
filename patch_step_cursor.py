import re
with open('src/pages/CheckoutPage.module.css', 'r') as f:
    code = f.read()

code = code.replace(".step {\n  flex: 1;", ".step {\n  flex: 1;\n  cursor: pointer;")

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(code)
