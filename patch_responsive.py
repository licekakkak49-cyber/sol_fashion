import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Replace the responsive block
old_responsive = """/* RESPONSIVE */
@media (max-width: 900px) {
  .checkoutContainer {
    flex-direction: column;
  }
  .leftCol, .rightCol {
    flex: 1 1 auto;
    width: 100%;
    padding: 24px;
  }
  .rightCol {
    border-left: none;
    border-top: 1px solid #eee;
    order: -1;
  }
}"""

new_responsive = """/* RESPONSIVE */
@media (max-width: 900px) {
  .checkoutContainer {
    flex-direction: column;
  }
  .leftCol {
    flex: 1 1 auto;
    width: 100%;
    padding: 24px 16px;
  }
  .rightCol {
    display: none;
  }
}"""

if "/* RESPONSIVE */" in css:
    css = css.replace(old_responsive, new_responsive)
else:
    css += "\n" + new_responsive

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
