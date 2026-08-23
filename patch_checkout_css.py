import re

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    code = f.read()

# Add closeBtn
if ".closeBtn {" not in code:
    code = code.replace(".checkoutContainer {\n  display: flex;", ".checkoutContainer {\n  display: flex;\n  position: relative;")
    close_css = """
.closeBtn {
  position: absolute;
  top: 40px;
  right: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgb(30, 30, 30);
  padding: 5px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.closeBtn:hover {
  transform: rotate(90deg);
}
"""
    code = code.replace("/* LEFT COLUMN */", close_css + "\n/* LEFT COLUMN */")

# Replace logo css
old_logo_css = """.logo {
  font-family: 'Oswald', 'Futura PT', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 60px;
  cursor: pointer;
}"""

new_logo_css = """.logoContainer {
  display: flex;
  align-items: baseline;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 60px;
}

.textLogo {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: rgb(30, 30, 30);
  text-transform: uppercase;
  line-height: 1;
}

.tagline {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgb(30, 30, 30);
  letter-spacing: 0.03em;
}"""

code = code.replace(old_logo_css, new_logo_css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(code)
