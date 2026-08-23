import re
with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

pattern = r"\.cartLargeDelivery\s*\{.*?\n\}"
match = re.search(pattern, css, flags=re.DOTALL)
if match:
    pulled = match.group(0)
    css = css.replace(pulled, "")
    css = css.replace("/* RESPONSIVE */", pulled + "\n/* RESPONSIVE */")
    with open('src/pages/CheckoutPage.module.css', 'w') as f:
        f.write(css)
    print("Fixed delivery!")
else:
    print("Not found delivery")
