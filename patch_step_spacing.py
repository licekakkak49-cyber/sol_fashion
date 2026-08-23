import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Update .step letter-spacing
css = re.sub(r"(\.step \{[^}]*?letter-spacing:\s*)0\.1em", r"\g<1>0.05em", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
