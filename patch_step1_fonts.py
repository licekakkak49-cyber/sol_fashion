import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Make the delivery date 12px instead of 11px for better readability with the large image
code = code.replace("fontSize: '11px', color: '#666', marginTop: '12px'", "fontSize: '12px', color: '#666', marginTop: '16px'")

# Add letter-spacing to the Qty text
code = code.replace("margin: '0 12px'", "margin: '0 16px', letterSpacing: '0.05em'")

# Add letter-spacing to the Edit / Remove links for a more editorial look
old_actions = """                      <div className={styles.cartLargeActions}>
                        <span className={styles.editLink}>Edit</span>
                        <span className={styles.editLink}>Remove</span>
                      </div>"""
new_actions = """                      <div className={styles.cartLargeActions} style={{ letterSpacing: '0.05em' }}>
                        <span className={styles.editLink}>Edit</span>
                        <span className={styles.editLink}>Remove</span>
                      </div>"""
code = code.replace(old_actions, new_actions)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
