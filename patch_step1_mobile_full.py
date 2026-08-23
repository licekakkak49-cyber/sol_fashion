import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# 1. Change "Shopping cart" to Desktop: "Shopping cart", Mobile: "Cart"
old_header = """<h2 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '16px', letterSpacing: '0.05em' }}>Shopping cart</h2>"""
new_header = """<h2 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '16px', letterSpacing: '0.05em' }}>
              <span className={styles.desktopOnly}>Shopping cart</span>
              <span className={styles.mobileOnly}>Cart</span>
            </h2>"""
code = code.replace(old_header, new_header)

# 2. Add classes to delivery date so we can style it responsively
old_delivery = """<div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>"""
new_delivery = """<div className={styles.cartLargeDelivery}>"""
code = code.replace(old_delivery, new_delivery)

# 3. Add classes to the Shipping row so we can hide it on mobile step 1
old_shipping = """          <div className={styles.subtotalRow}>
            <span>Shipping</span>
            <span>FREE</span>
          </div>"""
new_shipping = """          <div className={`${styles.subtotalRow} ${step === 1 ? styles.hideOnMobile : ''}`}>
            <span>Shipping</span>
            <span>FREE</span>
          </div>"""
code = code.replace(old_shipping, new_shipping)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)


with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Add base classes for new stuff
new_classes = """
.cartLargeDelivery {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}
"""
css = css.replace(".mobileOnly {", new_classes + "\n.mobileOnly {")

# Find the responsive block and inject our mobile styles for cartLarge elements and totals
responsive_mod = """
  .hideOnMobile {
    display: none !important;
  }
  .cartLargeImg {
    width: 80px !important;
    height: 100px;
    object-fit: cover;
  }
  .cartLargeItem {
    gap: 16px !important;
  }
  .cartLargeName, .cartLargePrice {
    font-size: 12px !important;
    font-weight: 400 !important;
  }
  .cartLargeVariant, .cartLargeQtyBox, .editLink {
    font-size: 12px !important;
  }
  .cartLargeMeta {
    gap: 4px !important;
    margin-top: 16px !important;
  }
  .cartLargeDelivery {
    font-size: 11px !important;
    margin-top: 16px !important;
  }
  
  /* Make mobile Step 1 Totals exactly like Cart Sidebar */
  .step1Active .totalsSection {
    padding-top: 24px !important;
    padding-bottom: 24px !important;
    border-top: 1px solid #eee !important;
  }
  .step1Active .totalRow {
    align-items: flex-end;
  }
  .step1Active .totalTitle {
    font-size: 13px !important;
    font-weight: 500 !important;
  }
  .step1Active .vatText {
    font-size: 10px !important;
    color: #666 !important;
  }
  .step1Active .totalPrice {
    font-size: 13px !important;
    font-weight: 500 !important;
  }
  .step1Active .btnSolidFull {
    margin-top: 24px !important;
    font-size: 11px !important;
    letter-spacing: 0.1em !important;
  }
"""

css = css.replace("  .cartLargeItem {\n    gap: 16px;\n  }", responsive_mod)
# Remove old duplicate cartLargeImg block from media query since we injected a better one
css = re.sub(r"\s*\.cartLargeImg \{\s*width: 100px;\s*\}\s*\.cartLargeName \{\s*font-size: 13px;\s*\}\s*\.cartLargeActions \{\s*margin-top: 24px;\s*\}", "", css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)

