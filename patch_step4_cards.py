import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Add paymentMethod state
if "const [paymentMethod," not in code:
    code = code.replace("const [step, setStep] = useState(2);", "const [step, setStep] = useState(2);\n  const [paymentMethod, setPaymentMethod] = useState('cards');")

# Replace payment methods block
old_payment_section = """              <label className={styles.paymentBox}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} />
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#1A1A1A"/>
                    <rect y="3" width="24" height="3" fill="#333333"/>
                  </svg>
                  <span className={styles.paymentMethodName}>Cards</span>
                </div>
              </label>

              <label className={styles.paymentBox}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} />
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#000"/>
                    <path d="M14.5 7.5C14.5 6.5 15.2 5.8 16.1 5.5C15.5 4.6 14.5 4.5 14.1 4.5C13.2 4.4 12.3 5 11.8 5C11.3 5 10.6 4.5 9.8 4.5C8.8 4.5 7.9 5.1 7.4 5.9C6.4 7.7 7.1 10.3 8.1 11.7C8.6 12.4 9.1 13.2 9.9 13.1C10.6 13.1 10.9 12.6 11.8 12.6C12.7 12.6 12.9 13.2 13.7 13.1C14.5 13.1 14.9 12.4 15.4 11.7C16 10.8 16.2 9.9 16.3 9.9C16.2 9.8 14.5 9.2 14.5 7.5ZM13.4 3.4C13.8 2.9 14.1 2.2 14 1.5C13.4 1.5 12.7 1.9 12.3 2.4C12 2.8 11.7 3.5 11.8 4.2C12.5 4.2 13.1 3.8 13.4 3.4Z" fill="white"/>
                  </svg>
                  <span className={styles.paymentMethodName}>Apple Pay</span>
                </div>
              </label>

              <label className={styles.paymentBox}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} />
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#003087"/>
                    <path d="M10.8 4H14C15.3 4 16.1 4.6 16.1 5.8C16.1 7.4 15 8.7 13.3 8.7H11.5L11 11.5H9.3L10.8 4Z" fill="white"/>
                    <path d="M12.6 9C13.8 9 14.5 8.3 14.7 7.2L14.3 9.8C14.2 10.3 13.8 10.6 13.2 10.6H11.6L11.3 12.5H9.6L10.3 9H12.6Z" fill="#0079C1"/>
                  </svg>
                  <span className={styles.paymentMethodName}>PayPal</span>
                </div>
              </label>"""

new_payment_section = """              <div className={`${styles.paymentBox} ${paymentMethod === 'cards' ? styles.paymentBoxExpanded : ''}`} onClick={() => setPaymentMethod('cards')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'cards'} readOnly />
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#1A1A1A"/>
                    <rect y="3" width="24" height="3" fill="#333333"/>
                  </svg>
                  <span className={styles.paymentMethodName}>Cards</span>
                </div>
                
                {paymentMethod === 'cards' && (
                  <div className={styles.paymentForm}>
                    <div className={styles.formRow} style={{ marginTop: '32px' }}>
                      <div className={styles.formField} style={{ flex: 2 }}>
                        <label className={styles.staticLabel}>Card number</label>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className={styles.textInput} style={{ paddingRight: '100px' }} />
                          <div className={styles.cardIcons}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" />
                          </div>
                        </div>
                      </div>
                      <div className={styles.formField} style={{ flex: 1 }}>
                        <label className={styles.staticLabel}>Expiration</label>
                        <input type="text" className={styles.textInput} />
                      </div>
                      <div className={styles.formField} style={{ flex: 1 }}>
                        <label className={styles.staticLabel}>CVC</label>
                        <input type="text" className={styles.textInput} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.paymentBox} onClick={() => setPaymentMethod('apple')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'apple'} readOnly />
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#000"/>
                    <path d="M14.5 7.5C14.5 6.5 15.2 5.8 16.1 5.5C15.5 4.6 14.5 4.5 14.1 4.5C13.2 4.4 12.3 5 11.8 5C11.3 5 10.6 4.5 9.8 4.5C8.8 4.5 7.9 5.1 7.4 5.9C6.4 7.7 7.1 10.3 8.1 11.7C8.6 12.4 9.1 13.2 9.9 13.1C10.6 13.1 10.9 12.6 11.8 12.6C12.7 12.6 12.9 13.2 13.7 13.1C14.5 13.1 14.9 12.4 15.4 11.7C16 10.8 16.2 9.9 16.3 9.9C16.2 9.8 14.5 9.2 14.5 7.5ZM13.4 3.4C13.8 2.9 14.1 2.2 14 1.5C13.4 1.5 12.7 1.9 12.3 2.4C12 2.8 11.7 3.5 11.8 4.2C12.5 4.2 13.1 3.8 13.4 3.4Z" fill="white"/>
                  </svg>
                  <span className={styles.paymentMethodName}>Apple Pay</span>
                </div>
              </div>

              <div className={styles.paymentBox} onClick={() => setPaymentMethod('paypal')}>
                <div className={styles.paymentBoxLeft}>
                  <input type="radio" name="payment" className={styles.customRadio} checked={paymentMethod === 'paypal'} readOnly />
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '8px'}}>
                    <rect width="24" height="16" rx="2" fill="#003087"/>
                    <path d="M10.8 4H14C15.3 4 16.1 4.6 16.1 5.8C16.1 7.4 15 8.7 13.3 8.7H11.5L11 11.5H9.3L10.8 4Z" fill="white"/>
                    <path d="M12.6 9C13.8 9 14.5 8.3 14.7 7.2L14.3 9.8C14.2 10.3 13.8 10.6 13.2 10.6H11.6L11.3 12.5H9.6L10.3 9H12.6Z" fill="#0079C1"/>
                  </svg>
                  <span className={styles.paymentMethodName}>PayPal</span>
                </div>
              </div>"""

code = code.replace(old_payment_section, new_payment_section)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)


with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

new_css = """
.paymentBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgba(0,0,0,0.2);
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.paymentBoxExpanded {
  border-color: rgb(30, 30, 30);
}

.paymentBox:hover {
  border-color: rgb(30, 30, 30);
}

.paymentBoxLeft {
  display: flex;
  align-items: center;
  gap: 16px;
}

.paymentForm {
  width: 100%;
  animation: fadeIn 0.4s ease forwards;
}

.cardIcons {
  position: absolute;
  right: 0;
  bottom: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.cardIcons img {
  height: 12px;
  object-fit: contain;
}
"""

# Replace old paymentBox
css = re.sub(r"\.paymentBox \{[\s\S]*?\}", "", css)
css = re.sub(r"\.paymentBox:hover \{[\s\S]*?\}", "", css)
css = re.sub(r"\.paymentBoxLeft \{[\s\S]*?\}", "", css)
# Wait, I'll just append it at the end, and the previous ones might be overridden or I can replace them carefully.
# Let's just find and replace the whole block

old_block = """.paymentBox {
  display: flex;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.2);
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.paymentBox:hover {
  border-color: rgb(30, 30, 30);
}

.paymentBoxLeft {
  display: flex;
  align-items: center;
  gap: 16px;
}"""

css = css.replace(old_block, new_css)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)

