import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    code = f.read()

fade_css = """
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.actionBlock {
  animation: fadeIn 0.4s ease forwards;
}
"""

if ".actionBlock {" not in code:
    code = code.replace(".actionRow {", fade_css + "\n.actionRow {")

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(code)
