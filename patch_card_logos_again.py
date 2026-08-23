import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Replace the base64 SVGs with standard PNGs
new_icons = """                          <div className={styles.cardIcons}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/320px-Visa_Inc._logo.svg.png" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/320px-MasterCard_Logo.svg.png" alt="Mastercard" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/320px-American_Express_logo_%282018%29.svg.png" alt="Amex" />
                          </div>"""

code = re.sub(r'<div className=\{styles\.cardIcons\}>[\s\S]*?</div>', new_icons, code)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
