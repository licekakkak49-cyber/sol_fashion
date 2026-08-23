import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# 1. Add step state
code = code.replace("const [email, setEmail] = useState('');", "const [email, setEmail] = useState('');\n  const [step, setStep] = useState(2);")

# 2. Update progress bar
old_progress = """        <div className={styles.progressContainer}>
          <div className={styles.step}>
            <span>1 of 4</span>
            <span>Cart</span>
          </div>
          <div className={`${styles.step} ${styles.stepActive}`}>
            <span>2 of 4</span>
            <span>Personal details</span>
          </div>
          <div className={styles.step}>
            <span>3 of 4</span>
            <span>Shipping details</span>
          </div>
          <div className={styles.step}>
            <span>4 of 4</span>
            <span>Payment & Confirmation</span>
          </div>
        </div>"""

new_progress = """        <div className={styles.progressContainer}>
          <div className={styles.step} onClick={() => setStep(1)}>
            <span>1 of 4</span>
            <span>Cart</span>
          </div>
          <div className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`} onClick={() => setStep(2)}>
            <span>2 of 4</span>
            <span>Personal details</span>
          </div>
          <div className={`${styles.step} ${step === 3 ? styles.stepActive : ''}`}>
            <span>3 of 4</span>
            <span>Shipping details</span>
          </div>
          <div className={`${styles.step} ${step === 4 ? styles.stepActive : ''}`}>
            <span>4 of 4</span>
            <span>Payment & Confirmation</span>
          </div>
        </div>"""
code = code.replace(old_progress, new_progress)

# 3. Add Step 3 UI
old_step2 = """        <input 
          type="email" 
          className={styles.emailInput} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />

        {isEmailValid && (
          <div className={styles.actionBlock}>
            <div className={styles.actionRow}>
              <button className={styles.btnSolid}>LOGIN</button>
              <button className={styles.btnOutline}>CONTINUE AS A GUEST</button>
            </div>

            <div className={styles.helpText}>
              If you wish to create an account, you can do so after payment.
            </div>

            <div className={styles.separator}>Or connect with</div>

            <button className={styles.googleBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              CONTINUE WITH GOOGLE
            </button>
          </div>
        )}"""

new_steps = """        {step === 2 && (
          <div className={styles.stepContainer}>
            <input 
              type="email" 
              className={styles.emailInput} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />

            {isEmailValid && (
              <div className={styles.actionBlock}>
                <div className={styles.actionRow}>
                  <button className={styles.btnSolid}>LOGIN</button>
                  <button className={styles.btnOutline} onClick={() => setStep(3)}>CONTINUE AS A GUEST</button>
                </div>

                <div className={styles.helpText}>
                  If you wish to create an account, you can do so after payment.
                </div>

                <div className={styles.separator}>Or connect with</div>

                <button className={styles.googleBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  CONTINUE WITH GOOGLE
                </button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContainer}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Gender *</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mrs" className={styles.customRadio} /> <span>Mrs</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mr" className={styles.customRadio} /> <span>Mr</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Mx" className={styles.customRadio} /> <span>Mx</span></label>
                <label className={styles.radioLabel}><input type="radio" name="gender" value="Prefer not to say" className={styles.customRadio} /> <span>I prefer not to say</span></label>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>First Name *</label>
                <input type="text" className={styles.textInput} />
              </div>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>Last Name *</label>
                <input type="text" className={styles.textInput} />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.staticLabel}>Country/Region *</label>
              <select className={styles.selectInput}>
                <option value="Thailand">Thailand</option>
              </select>
            </div>

            <div className={styles.formField}>
              <label className={styles.staticLabel}>Address 1 *</label>
              <input type="text" className={styles.textInput} />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField} style={{ flex: '0 0 35%' }}>
                <label className={styles.staticLabel}>Prefix</label>
                <select className={styles.selectInput}>
                  <option value="+66">Thailand +66</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.staticLabel}>Phone Number *</label>
                <input type="text" className={styles.textInput} />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="radio" name="gift" className={styles.customRadio} />
                <span className={styles.checkboxTitle}>Gift packaging</span>
              </label>
              <span className={styles.checkboxSubtext}>One gift packaging per order</span>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '40px' }}>
              <label className={styles.formLabel}>Delivery method</label>
              <label className={styles.deliveryBox}>
                <div className={styles.deliveryBoxLeft}>
                  <input type="radio" name="delivery" defaultChecked className={styles.customRadio} />
                  <div className={styles.deliveryDetails}>
                    <span className={styles.deliveryTitle}>Express</span>
                    <span className={styles.deliverySubtext}>Delivery within 2-4 days</span>
                  </div>
                </div>
                <span className={styles.deliveryPrice}>FREE</span>
              </label>
            </div>

            <button className={styles.btnSolidFull} onClick={() => setStep(4)} style={{ marginTop: '40px' }}>PAYMENT</button>
          </div>
        )}"""

code = code.replace(old_step2, new_steps)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
