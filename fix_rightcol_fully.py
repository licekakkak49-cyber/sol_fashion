import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Find the entire rightCol
start_idx = code.find('      {/* RIGHT COLUMN */}')
if start_idx != -1:
    old_right_col = code[start_idx:code.rfind('    </div>\n  );\n};')]
    
    # We will rewrite rightCol completely to be clean.
    new_right_col = """      {/* RIGHT COLUMN */}
      <div className={styles.rightCol}>
        {step === 1 && (
          <div style={{ marginBottom: 'auto' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '400', marginBottom: '16px', letterSpacing: '0.05em' }}>Shopping cart</h2>
            <div style={{ fontSize: '11px', color: '#666' }}>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</div>
          </div>
        )}

        {step > 1 && (
          <>
            <div className={styles.summaryHeader}>
              <span className={styles.summaryTitle}>Order summary</span>
              <span className={styles.editCart} onClick={handleEditCart}>Edit cart</span>
            </div>

            <div className={styles.cartItemsList}>
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className={styles.item}>
                    <div className={styles.itemTop}>
                      <img 
                        src={item.image || item.variant?.images?.[0] || item.coverImage} 
                        alt={item.name} 
                        className={styles.itemImage} 
                      />
                      <div className={styles.itemDetails}>
                        <div className={styles.itemHeaderRow}>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                        </div>
                        
                        <div className={styles.itemMeta}>
                          <p className={styles.metaText}>{item.variant?.name || 'Dark Brown'}</p>
                          {(item.size || item.selectedSize) && (
                            <p className={styles.metaText}>Size {item.size || item.selectedSize}</p>
                          )}
                          <p className={styles.metaText}>Qty {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                    <p className={styles.deliveryEstimate}>
                      Estimated delivery date: from {getFutureDate()}
                    </p>
                  </div>
                ))
              ) : (
                <div className={styles.item}>
                  <div className={styles.itemTop}>
                    <div className={styles.itemDetails}>
                      <p className={styles.itemName}>Your cart is empty</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className={styles.totalsSection}>
          <div className={styles.subtotalRow}>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} item{cart.length !== 1 && 's'}</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className={styles.subtotalRow}>
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          
          <div className={styles.totalRow}>
            <div className={styles.totalLabel}>
              <h3 className={styles.totalTitle}>TOTAL</h3>
              <p className={styles.vatText}>VAT Included</p>
            </div>
            <h3 className={styles.totalPrice}>{formatPrice(cartTotal)}</h3>
          </div>
          
          {step === 1 && (
            <button className={styles.btnSolidFull} style={{ marginTop: '24px' }} onClick={() => setStep(2)}>PROCEED TO CHECKOUT</button>
          )}
        </div>
      </div>
"""
    code = code[:start_idx] + new_right_col + code[code.rfind('    </div>\n  );\n};'):]
    
    with open('src/pages/CheckoutPage.jsx', 'w') as f:
        f.write(code)
    print("Replaced rightCol successfully!")
else:
    print("Could not find rightCol start!")

