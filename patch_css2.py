import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    code = f.read()

# Update actionRow margin
code = code.replace(".actionRow {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 24px;\n}", ".actionRow {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 8px;\n}")

# Add .item class
item_css = """
.item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.itemTop {"""

code = code.replace("\n.itemTop {", item_css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(code)
