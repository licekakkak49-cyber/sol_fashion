import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Replace the img tags for cards
old_imgs = """<div className={styles.cardIcons}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" />
                          </div>"""
new_imgs = """<div className={styles.cardIcons}>
                            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/visa.svg" alt="Visa" style={{ filter: 'brightness(0)' }} />
                            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mastercard.svg" alt="Mastercard" style={{ filter: 'brightness(0)' }} />
                            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/americanexpress.svg" alt="Amex" style={{ filter: 'brightness(0)' }} />
                          </div>"""
code = code.replace(old_imgs, new_imgs)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
