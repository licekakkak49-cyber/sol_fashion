import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Increase margin-top of .cartLargeMeta from 16px to 24px
css = re.sub(r"(\.cartLargeMeta \{[^}]*?margin-top:\s*)16px", r"\g<1>24px", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
