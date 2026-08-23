import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Replace the img tags for cards
old_imgs = """<div className={styles.cardIcons}>
                            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/visa.svg" alt="Visa" style={{ filter: 'brightness(0)' }} />
                            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mastercard.svg" alt="Mastercard" style={{ filter: 'brightness(0)' }} />
                            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/americanexpress.svg" alt="Amex" style={{ filter: 'brightness(0)' }} />
                          </div>"""

new_imgs = """<div className={styles.cardIcons}>
                            <img src="https://raw.githubusercontent.com/aaronfay/payment-icons/master/svg/flat/visa.svg" alt="Visa" style={{ height: '16px' }} />
                            <img src="https://raw.githubusercontent.com/aaronfay/payment-icons/master/svg/flat/mastercard.svg" alt="Mastercard" style={{ height: '16px' }} />
                            <img src="https://raw.githubusercontent.com/aaronfay/payment-icons/master/svg/flat/amex.svg" alt="Amex" style={{ height: '16px' }} />
                          </div>"""

code = code.replace(old_imgs, new_imgs)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
