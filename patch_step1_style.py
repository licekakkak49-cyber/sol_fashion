import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Make the image bigger (220px)
css = re.sub(r"(\.cartLargeImg \{[^}]*?width:\s*)\d+px", r"\g<1>220px", css)

# Increase gap
css = re.sub(r"(\.cartLargeItem \{[^}]*?gap:\s*)\d+px", r"\g<1>40px", css)

# Adjust fonts to fit luxury style
# cartLargeName -> 14px is fine, maybe 15px? Let's use 14px but maybe ensure letter-spacing
# cartLargeVariant -> 12px -> 13px for readability
css = re.sub(r"(\.cartLargeVariant \{[^}]*?font-size:\s*)\d+px", r"\g<1>13px", css)
css = re.sub(r"(\.cartLargeVariant \{[^}]*?color:\s*)#666", r"\g<1>#444", css) # Slightly darker for better contrast

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
