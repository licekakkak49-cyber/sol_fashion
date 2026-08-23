import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Extract the media query block
# Since we know it starts with @media (max-width: 900px) { ... }
# Let's find it. It might be tricky to regex match nested brackets.
# Let's just find the start of it, and we know in our file it was inserted where it was originally.
match = re.search(r'/\* RESPONSIVE \*/\n@media \(max-width: 900px\) \{[\s\S]*?\}', css)

# Wait, if there are multiple @media blocks or nested brackets, regex is risky.
# Let's parse it more carefully or just move ALL lines starting from /* RESPONSIVE */ to the end.
# Actually, the file structure has `/* RESPONSIVE */` and then the block. 
