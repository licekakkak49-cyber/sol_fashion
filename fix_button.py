import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

old_total = """            <h3 className={styles.totalPrice}>{formatPrice(cartTotal)}</h3>
          </div>
        </div>"""

new_total = """            <h3 className={styles.totalPrice}>{formatPrice(cartTotal)}</h3>
          </div>
          {step === 1 && (
            <button className={styles.btnSolidFull} style={{ marginTop: '24px' }} onClick={() => setStep(2)}>PROCEED TO CHECKOUT</button>
          )}
        </div>"""

code = code.replace(old_total, new_total)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
