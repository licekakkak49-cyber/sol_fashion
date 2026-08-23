import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# I will just replace the relevant block in the media query
old_block = """  .cartLargeName, .cartLargePrice {
    font-size: 12px !important;
    font-weight: 400 !important;
  }
  .cartLargeVariant, .cartLargeQtyBox, .editLink {
    font-size: 12px !important;
  }
  .cartLargeMeta {
    gap: 4px !important;
    margin-top: 16px !important;
  }"""

new_block = """  .cartLargeName {
    font-size: 12px !important;
    font-weight: 400 !important;
  }
  .cartLargePrice, .cartLargeVariant, .cartLargeQtyBox, .editLink {
    font-size: 11px !important;
  }
  .cartLargeMeta {
    gap: 4px !important;
    margin-top: 16px !important;
  }
  .cartLargeDetails {
    padding: 12px 0 !important;
  }
  .cartItemsList {
    gap: 24px !important;
  }"""

css = css.replace(old_block, new_block)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
