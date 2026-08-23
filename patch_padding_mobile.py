import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Change padding from 24px 16px to 24px 10px in leftCol
css = re.sub(r"(\.leftCol\s*\{[^}]*?padding:\s*24px\s*)16px", r"\g<1>10px", css)

# Change padding from 24px 16px to 24px 10px in step1Active rightCol
css = re.sub(r"(\.step1Active\s*\.rightCol\s*\{[^}]*?padding:\s*24px\s*)16px", r"\g<1>10px", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
