import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Replace the cardIcons block with the Jacquemus links
new_icons = """                          <div className={styles.cardIcons}>
                            <img src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dwb1b33da1/images/cardBrands/visa.svg" alt="Visa" />
                            <img src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw529ef188/images/cardBrands/mc.svg" alt="Mastercard" />
                            <img src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw0026e251/images/cardBrands/amex.svg" alt="Amex" />
                          </div>"""

code = re.sub(r'<div className=\{styles\.cardIcons\}>[\s\S]*?</div>', new_icons, code)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
