import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

old_block = """  .cartLargePrice, .cartLargeVariant, .cartLargeQtyBox, .editLink {
    font-size: 11px !important;
  }"""
new_block = """  .cartLargePrice, .cartLargeVariant, .cartLargeQtyBox, .editLink {
    font-size: 11px !important;
    letter-spacing: 0.03em !important;
  }"""

css = css.replace(old_block, new_block)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
