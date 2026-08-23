import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Change margin-top: 0 !important to 12px !important
css = re.sub(r"(\.cartLargeDelivery\s*\{[^}]*?margin-top:\s*)0\s*!important", r"\g<1>12px !important", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
