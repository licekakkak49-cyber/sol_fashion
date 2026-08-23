import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Update cartLargeDelivery to margin-top: 0
css = re.sub(r"(\.cartLargeDelivery\s*\{[^}]*?margin-top:\s*)16px\s*!important", r"\g<1>0 !important", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
