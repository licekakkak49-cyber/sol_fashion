import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Add color: #555 to cartLargePrice in mobile block
old_block = """  .cartLargePrice, .cartLargeVariant, .cartLargeQtyBox, .editLink {"""
new_block = """  .cartLargePrice {
    color: #555 !important;
  }
  .cartLargePrice, .cartLargeVariant, .cartLargeQtyBox, .editLink {"""

css = css.replace(old_block, new_block)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
