import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    code = f.read()

old_tagline = """.tagline {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgb(30, 30, 30);
  letter-spacing: 0.03em;
}"""

new_tagline = """.tagline {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #8E9196;
  font-style: italic;
  letter-spacing: 0.1em;
  white-space: nowrap;
}"""

code = code.replace(old_tagline, new_tagline)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(code)
