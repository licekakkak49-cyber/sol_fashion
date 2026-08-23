with open('src/pages/CheckoutPage.jsx', 'r') as f:
    code = f.read()

code = code.replace("{cartItems.length} items", "{cart.reduce((sum, item) => sum + item.quantity, 0)} items")

with open('src/pages/CheckoutPage.jsx', 'w') as f:
    f.write(code)
