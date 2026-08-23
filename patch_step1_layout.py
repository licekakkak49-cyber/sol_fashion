import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

old_details = """                    <div className={styles.cartLargeDetails}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                        <span className={styles.cartLargeName}>{item.name}</span>
                        <span className={styles.cartLargePrice}>{formatPrice(item.price)}</span>
                      </div>
                      
                      <div className={styles.cartLargeVariant}>
                        {item.variant?.name || 'Dark Brown'}
                      </div>
                      {(item.size || item.selectedSize) && (
                        <div className={styles.cartLargeVariant}>
                          Size {item.size || item.selectedSize}
                        </div>
                      )}
                      
                      <div className={styles.cartLargeQtyBox}>
                         <span style={{cursor: 'pointer'}}>-</span>
                         <span style={{margin: '0 16px', letterSpacing: '0.05em'}}>Qty {item.quantity}</span>
                         <span style={{cursor: 'pointer'}}>+</span>
                      </div>

                      <div className={styles.cartLargeActions} style={{ letterSpacing: '0.05em' }}>
                        <span className={styles.editLink}>Edit</span>
                        <span className={styles.editLink}>Remove</span>
                      </div>
                    </div>"""

new_details = """                    <div className={styles.cartLargeDetails}>
                      <div className={styles.cartLargeHeaderRow}>
                        <span className={styles.cartLargeName}>{item.name}</span>
                        <span className={styles.cartLargePrice}>{formatPrice(item.price)}</span>
                      </div>
                      
                      <div className={styles.cartLargeMeta}>
                        <div className={styles.cartLargeVariant}>
                          {item.variant?.name || 'Dark Brown'}
                        </div>
                        {(item.size || item.selectedSize) && (
                          <div className={styles.cartLargeVariant}>
                            Size {item.size || item.selectedSize}
                          </div>
                        )}
                        
                        <div className={styles.cartLargeQtyBox}>
                          <span style={{cursor: 'pointer'}}>-</span>
                          <span style={{margin: '0 16px', letterSpacing: '0.05em'}}>Qty {item.quantity}</span>
                          <span style={{cursor: 'pointer'}}>+</span>
                        </div>
                      </div>

                      <div className={styles.cartLargeActions} style={{ letterSpacing: '0.05em' }}>
                        <span className={styles.editLink}>Edit</span>
                        <span className={styles.editLink}>Remove</span>
                      </div>
                    </div>"""

code = code.replace(old_details, new_details)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)

with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# I will append new CSS classes that mirror CartSidebar structure
new_css_classes = """
.cartLargeHeaderRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.cartLargeMeta {
  display: flex;
  flex-direction: column;
  gap: 6px; /* Similar to CartSidebar meta gap */
  margin-top: 16px; /* Gap between header and meta */
}
"""
css += new_css_classes

# I also need to fix .cartLargeName and .cartLargeVariant to match
css = re.sub(r"(\.cartLargeName \{[^}]*?font-weight:\s*)500", r"\g<1>400", css)
# Remove the inline margin-bottom from cartLargeVariant since we use flex gap now
css = re.sub(r"(\.cartLargeVariant \{[^}]*?)margin-bottom:\s*8px;", r"\1", css)

# Make margin-bottom: auto on cartLargeMeta instead of cartLargeQtyBox
css = re.sub(r"(\.cartLargeQtyBox \{[^}]*?)margin-bottom:\s*auto;", r"\1", css)
css = css.replace(".cartLargeMeta {", ".cartLargeMeta {\n  margin-bottom: auto;")

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)

