import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Replace the incorrect mobile image styling
old_img = """  .cartLargeImg {
    width: 80px !important;
    height: 100px;
    object-fit: cover;
  }"""
new_img = """  .cartLargeImg {
    width: 130px !important;
    height: auto !important;
    aspect-ratio: 4/5 !important;
    object-fit: cover;
  }"""
css = css.replace(old_img, new_img)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
