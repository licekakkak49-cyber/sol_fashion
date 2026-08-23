import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Add align-items: flex-start to checkoutContainer
css = re.sub(r"(\.checkoutContainer \{[\s\S]*?display: flex;)", r"\g<1>\n  align-items: flex-start;", css)

# Update rightCol to be sticky and have height 100vh
old_rightCol = """.rightCol {
  flex: 0 0 40%;
  background-color: #fff;
  border-left: 1px solid #eee;
  padding: 40px 60px 0 60px;
  display: flex;
  flex-direction: column;
}"""

new_rightCol = """.rightCol {
  flex: 0 0 40%;
  background-color: #fff;
  border-left: 1px solid #eee;
  padding: 40px 60px 0 60px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}"""

css = css.replace(old_rightCol, new_rightCol)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
