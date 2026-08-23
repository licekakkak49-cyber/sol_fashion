import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    code = f.read()

# Update actionRow margin from 8px to 16px
code = code.replace(".actionRow {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 8px;\n}", ".actionRow {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 16px;\n}")

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(code)
