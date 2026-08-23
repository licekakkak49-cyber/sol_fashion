import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# progressContainer margin-bottom: 60px -> 40px
css = re.sub(r"(\.progressContainer\s*\{[^}]*?margin-bottom:\s*)60px", r"\g<1>40px", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
