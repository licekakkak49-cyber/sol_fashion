import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# leftCol padding: 40px 80px 40px 40px -> 24px 80px 40px 40px
css = re.sub(r"(\.leftCol\s*\{[^}]*?padding:\s*)40px 80px 40px 40px", r"\g<1>24px 80px 40px 40px", css)

# rightCol padding: 40px 60px 0 60px -> 24px 60px 0 60px
css = re.sub(r"(\.rightCol\s*\{[^}]*?padding:\s*)40px 60px 0 60px", r"\g<1>24px 60px 0 60px", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
