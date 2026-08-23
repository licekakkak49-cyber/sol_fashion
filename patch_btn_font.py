import re
with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

css = re.sub(r"(\.btnSolidFull \{[^}]*?font-size:\s*)11px", r"\g<1>14px", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
