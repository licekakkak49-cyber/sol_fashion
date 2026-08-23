import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Update .reviewTitle
css = re.sub(r"(\.reviewTitle \{[^}]*?font-size:\s*)13px", r"\g<1>14px", css)

# Update .editLink
css = re.sub(r"(\.editLink \{[^}]*?font-size:\s*)11px", r"\g<1>14px", css)

# Update .reviewText
css = re.sub(r"(\.reviewText \{[^}]*?font-size:\s*)13px", r"\g<1>14px", css)

# Update .reviewSubtext
css = re.sub(r"(\.reviewSubtext \{[^}]*?font-size:\s*)11px", r"\g<1>14px", css)

# Update .paymentMethodName
css = re.sub(r"(\.paymentMethodName \{[^}]*?font-size:\s*)13px", r"\g<1>14px", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
