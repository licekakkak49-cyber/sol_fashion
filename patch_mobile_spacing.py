import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# 1. Reduce top padding of leftCol on mobile (from 24px 10px to 16px 10px)
css = re.sub(r"(\.leftCol\s*\{[^}]*?padding:\s*)24px\s*10px", r"\g<1>16px 10px", css)

# 2. Fix progressContainer on mobile
old_progress = """  .progressContainer {
    overflow-x: auto;
    white-space: nowrap;
    gap: 24px;
    padding-bottom: 24px;
  }"""
new_progress = """  .progressContainer {
    overflow-x: auto;
    white-space: nowrap;
    gap: 24px;
    padding-bottom: 0;
    margin-bottom: 24px;
  }
  .step {
    padding-bottom: 12px;
  }"""
css = css.replace(old_progress, new_progress)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
