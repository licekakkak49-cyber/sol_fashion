import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# 1. Ensure step starts at 1
code = re.sub(r'const \[step, setStep\] = useState\(\d\);', 'const [step, setStep] = useState(1);', code)

# 2. Insert step === 1 block right before step === 2
step1_block = """        {step === 1 && (
          <div className={styles.stepContainer}>
            <h2 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '24px' }}>Your products</h2>
            <div className={styles.cartLargeList}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '40px' }}>
                  <div className={styles.cartLargeItem}>
                    <img src={item.image} alt={item.name} className={styles.cartLargeImg} />
                    <div className={styles.cartLargeDetails}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                        <span className={styles.cartLargeName}>{item.name}</span>
                        <span className={styles.cartLargePrice}>{item.price} USD</span>
                      </div>
                      
                      {item.variants && item.variants.map((v, i) => (
                        <div key={i} className={styles.cartLargeVariant}>
                          {v.name === 'Size' ? `Size ${v.value}` : v.value}
                        </div>
                      ))}
                      
                      <div className={styles.cartLargeQtyBox}>
                         <span style={{cursor: 'pointer'}}>-</span>
                         <span style={{margin: '0 12px'}}>Qty {item.quantity}</span>
                         <span style={{cursor: 'pointer'}}>+</span>
                      </div>

                      <div className={styles.cartLargeActions}>
                        <span className={styles.editLink}>Edit</span>
                        <span className={styles.editLink}>Remove</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '12px' }}>
                    Estimated delivery date: from {getFutureDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2"""

if "step === 1 && (" not in code:
    code = code.replace("{step === 2", step1_block)

# 3. Modify right column to conditionally render summaryHeader and to add Step 1 stuff
# We need to find <div className={styles.summaryHeader}>
right_col_start = """      <div className={styles.rightCol}>
        <div className={styles.summaryHeader}>"""

new_right_col = """      <div className={styles.rightCol}>
        {step === 1 && (
          <div style={{ marginBottom: 'auto' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '16px', letterSpacing: '0.05em' }}>Shopping cart</h2>
            <div style={{ fontSize: '11px', color: '#666' }}>{cartItems.length} items</div>
          </div>
        )}

        {step > 1 && (
          <div className={styles.summaryHeader}>"""

if "step > 1 && (" not in code:
    code = code.replace(right_col_start, new_right_col)
    
    # Close the step > 1 block right before totalsSection
    code = code.replace("""<div className={styles.totalsSection}>""", """</div>
        )}

        <div className={styles.totalsSection}>""")

# 4. Add PROCEED TO CHECKOUT button in totalsSection for Step 1
totals_button = """          {step === 1 && (
            <button className={styles.btnSolidFull} style={{ marginTop: '24px' }} onClick={() => setStep(2)}>PROCEED TO CHECKOUT</button>
          )}
        </div>
      </div>
    </div>"""

if "PROCEED TO CHECKOUT" not in code.split('totalsSection')[1] if len(code.split('totalsSection')) > 1 else "":
    code = code.replace("""        </div>\n      </div>\n    </div>""", totals_button)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)


with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

new_css = """
.cartLargeList {
  display: flex;
  flex-direction: column;
}

.cartLargeItem {
  display: flex;
  gap: 24px;
}

.cartLargeImg {
  width: 120px;
  aspect-ratio: 4/5;
  object-fit: cover;
}

.cartLargeDetails {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cartLargeName {
  font-size: 14px;
  font-weight: 500;
}

.cartLargePrice {
  font-size: 14px;
  color: #666;
}

.cartLargeVariant {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.cartLargeQtyBox {
  margin-top: 16px;
  margin-bottom: auto;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.cartLargeActions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
}
"""
if ".cartLargeList" not in css:
    with open('src/pages/CheckoutPage.module.css', 'a') as f:
        f.write("\n" + new_css)
