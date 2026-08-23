import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# 1. Initialize email to empty and add isValidEmail
code = code.replace("const [email, setEmail] = useState('alizzlolp11@gmail.com');", "const [email, setEmail] = useState('');\n  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);")

# 2. Wrap action block in condition
old_action_block = """        <div className={styles.actionRow}>
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
        </button>"""

new_action_block = """        {isEmailValid && (
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

code = code.replace(old_action_block, new_action_block)

# Add animation wrapper for a smoother experience! Wait, I removed framer-motion.
# I'll just use standard conditional rendering, which is fine. The user will see it pop up instantly.
# If I want it to be smooth, I can add a CSS class .actionBlock { animation: fadeIn 0.3s ease; }

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
