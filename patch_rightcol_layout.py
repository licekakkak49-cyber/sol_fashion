import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# 1. Remove marginBottom: 'auto' from the header block in Step 1
code = code.replace("<div style={{ marginBottom: 'auto' }}>", "<div style={{ marginBottom: '40px' }}>")

# 2. Conditionally hide the subtotalRow containing X items in step 1
subtotal_row = """          <div className={styles.subtotalRow}>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} item{cart.length !== 1 && 's'}</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>"""
new_subtotal_row = """          {step > 1 && (
            <div className={styles.subtotalRow}>
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} item{cart.length !== 1 && 's'}</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          )}"""
code = code.replace(subtotal_row, new_subtotal_row)

# 3. Add inline styles to totalsSection to remove border and margin-top in Step 1
totals_section = """        <div className={styles.totalsSection}>"""
new_totals_section = """        <div className={styles.totalsSection} style={step === 1 ? { borderTop: 'none', marginTop: '0', paddingTop: '0' } : {}}>"""
code = code.replace(totals_section, new_totals_section)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)

