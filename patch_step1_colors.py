import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Remove color: #666 from cartLargePrice to match CartSidebar (black)
css = re.sub(r"(\.cartLargePrice \{[^}]*?)color:\s*#666;", r"\1", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
