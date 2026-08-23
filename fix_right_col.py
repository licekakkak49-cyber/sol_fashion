import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Replace the broken step > 1 block
old_block = """        {step > 1 && (
          <div className={styles.summaryHeader}>
          <span className={styles.summaryTitle}>Order summary</span>
          <span className={styles.editCart} onClick={handleEditCart}>Edit cart</span>
        </div>

        <div className={styles.cartItemsList}>"""

new_block = """        {step > 1 && (
          <>
            <div className={styles.summaryHeader}>
              <span className={styles.summaryTitle}>Order summary</span>
              <span className={styles.editCart} onClick={handleEditCart}>Edit cart</span>
            </div>

            <div className={styles.cartItemsList}>"""
code = code.replace(old_block, new_block)

old_end = """        </div>
        )}

        <div className={styles.totalsSection}>"""

new_end = """            </div>
          </>
        )}

        <div className={styles.totalsSection}>"""
code = code.replace(old_end, new_end)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
