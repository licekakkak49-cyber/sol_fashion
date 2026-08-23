import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Increase gap from 6px to 12px
css = re.sub(r"(\.cartLargeMeta \{[^}]*?gap:\s*)6px", r"\g<1>12px", css)

# Add margin-top to qty box
css = re.sub(r"(\.cartLargeQtyBox \{)", r"\1\n  margin-top: 4px;", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
