import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

old_step4 = """          <div className={`${styles.step} ${step === 4 ? styles.stepActive : ''}`}>
            <span>4 of 4</span>
            <span>Payment & Confirmation</span>
          </div>"""
          
new_step4 = """          <div className={`${styles.step} ${step === 4 ? styles.stepActive : ''}`}>
            <span>4 of 4</span>
            <span className={styles.desktopOnly}>Payment & Confirmation</span>
            <span className={styles.mobileOnly}>Payment &<br/>Confirmation</span>
          </div>"""

code = code.replace(old_step4, new_step4)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)


with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Add display logic to top of file
new_classes = """
.mobileOnly {
  display: none;
}
.desktopOnly {
  display: inline;
}
"""
css = new_classes + css

# Add to the responsive block
responsive_mod = """
  .mobileOnly {
    display: inline;
  }
  .desktopOnly {
    display: none;
  }
"""

css = css.replace(".progressContainer::-webkit-scrollbar {", responsive_mod + "\n  .progressContainer::-webkit-scrollbar {")

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)

