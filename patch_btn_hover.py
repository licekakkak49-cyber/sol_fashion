import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

old_hover = """.btnOutline:hover {
  background-color: rgba(0,0,0,0.05);
}"""

new_hover = """.btnOutline:hover {
  background-color: rgb(30, 30, 30);
  color: #fff;
}"""

css = css.replace(old_hover, new_hover)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
