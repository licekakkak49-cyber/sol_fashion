import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Remove Gift Packaging block
gift_block = """            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="radio" name="gift" className={styles.customRadio} />
                <span className={styles.checkboxTitle}>Gift packaging</span>
              </label>
              <span className={styles.checkboxSubtext}>One gift packaging per order</span>
            </div>

"""
code = code.replace(gift_block, "")

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)


with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Update formLabel
old_formLabel = """.formLabel {
  display: block;
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgb(150, 150, 150);
  margin-bottom: 16px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}"""
new_formLabel = """.formLabel {
  display: block;
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: rgb(150, 150, 150);
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}"""
css = css.replace(old_formLabel, new_formLabel)

# Update delivery text size
old_deliveryTitle = """.deliveryTitle {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgb(30, 30, 30);
  letter-spacing: 0.03em;
}"""
new_deliveryTitle = """.deliveryTitle {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgb(30, 30, 30);
  letter-spacing: 0.03em;
}"""
css = css.replace(old_deliveryTitle, new_deliveryTitle)

old_deliverySubtext = """.deliverySubtext {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 11px;
  color: rgb(150, 150, 150);
  letter-spacing: 0.03em;
}"""
new_deliverySubtext = """.deliverySubtext {
  font-family: 'Futura PT', 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: rgb(150, 150, 150);
  letter-spacing: 0.03em;
}"""
css = css.replace(old_deliverySubtext, new_deliverySubtext)


with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)

