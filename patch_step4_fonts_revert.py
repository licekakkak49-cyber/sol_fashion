import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Update .editLink back to 11px
css = re.sub(r"(\.editLink \{[^}]*?font-size:\s*)14px", r"\g<1>11px", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
