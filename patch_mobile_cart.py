import re

with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

# Add a class to checkoutContainer based on step
old_container = """    <div className={styles.checkoutContainer}>"""
new_container = """    <div className={`${styles.checkoutContainer} ${step === 1 ? styles.step1Active : ''}`}>"""
code = code.replace(old_container, new_container)

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)


with open('src/pages/CheckoutPage.module.css', 'r') as f:
    css = f.read()

# Fix mobile CSS for rightCol
old_mobile_right = """  .rightCol {
    display: none;
  }"""
new_mobile_right = """  .rightCol {
    display: none;
  }
  .step1Active .rightCol {
    display: flex;
    order: 2;
    height: auto;
    overflow-y: visible;
    border-left: none;
    border-top: 1px solid #eee;
    padding: 24px 16px;
  }
  .step1Active .leftCol {
    height: auto;
    overflow-y: visible;
  }
  .step1Active {
    overflow-y: auto;
  }
  
  .cartLargeItem {
    gap: 16px;
  }
  .cartLargeImg {
    width: 100px;
  }
  .cartLargeName {
    font-size: 13px;
  }
  .cartLargeActions {
    margin-top: 24px;
  }
  
  .progressContainer {
    overflow-x: auto;
    white-space: nowrap;
    gap: 24px;
    padding-bottom: 24px;
  }
  .progressContainer::-webkit-scrollbar {
    display: none;
  }
  .step {
    flex: 0 0 auto;
  }"""

css = css.replace(old_mobile_right, new_mobile_right)

with open('src/pages/CheckoutPage.module.css', 'w') as f:
    f.write(css)
